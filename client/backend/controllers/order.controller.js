const orderService = require("../services/order.service");
const emailService = require("../services/emailService");
const { getAxios, getWarehouse, trackOrder } = require("../services/shipmozo.service");
const Product = require("../models/Product");
const Category = require("../models/Category"); // Import Category model
const Coupon = require("../models/Coupon"); // Import Coupon model

function getUnitPriceForPack(product, pack_type) {
  const basePrice = product.discount_price || product.p_price;
  const pack = pack_type || "Pack of 1";

  switch (pack) {
    case "Pack of 2":
      return Math.round(basePrice * 2 * 0.85); // 15% discount
    case "Pack of 4 (Family Discount)":
      return Math.round(basePrice * 4 *  0.8); // 20% discount
    default: // Pack of 1
      return Math.round(basePrice);
  }
}

module.exports = {
  async getOrders(req, res) {
    try {
      let orders = await orderService.findAll(req.user.email);

      // Identify orders to track
      // Statuses that do NOT require tracking: delivered, cancelled, reqForCancel
      const finalStatuses = ["delivered", "cancelled", "reqforcancel"];
      
      const ordersToTrack = orders.filter(order => {
        const status = (order.status || "").toLowerCase();
        return order.awb_number && !finalStatuses.includes(status);
      });

      if (ordersToTrack.length > 0) {
        await Promise.all(ordersToTrack.map(async (order) => {
          try {
            const trackRes = await trackOrder(order.awb_number);
            if (trackRes && trackRes.result === "1") {
               // Update the order with new tracking info
               await orderService.updateTracking(order.order_id, trackRes);
            }
          } catch (err) {
            // Log but don't fail the whole request
            console.error(`Auto-tracking failed for order ${order.order_id}:`, err.message);
          }
        }));

        // Refetch to get updated data
        orders = await orderService.findAll(req.user.email);
      }

      return res.json({ orders });
    } catch (err) {
      console.error("getOrders error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  /**
   * CREATE ORDER
   * 1. validate input
   * 2. build Shipmozo payload
   * 3. call /push-order
   * 4. save to DB
   * 5. Update coupon usage (if applicable)
   */
  async createOrder(req, res) {
    console.log("--- CREATE ORDER START ---");
    try {
      const body = req.body;
      const { coupon: appliedCouponFromFrontend } = body; // Get coupon details from frontend
      // Map client's alternativePhone to alternate_phone for consistency
      if (body.customer.alternativePhone) {
        body.customer.alternate_phone = body.customer.alternativePhone;
      }

      // Check duplicate order_id
      const existing = await orderService.findByOrderId(body.order_id);
      if (existing) {
        console.log("Error: Duplicate order_id");
        return res
          .status(400)
          .json({ error: "Order already exists with this order_id" });
      }

      console.log("2. Getting warehouse and Axios instance...");
      const warehouse = await getWarehouse();
      const axiosInstance = await getAxios();
      console.log("... Warehouse and Axios instance obtained.");

      // Enrich items with product details from DB
      const enrichedItems = await Promise.all(
        body.items.map(async (item) => {
          const product = await Product.findById(item.sku_number).populate(
            "p_category"
          ); // Populate p_category
          if (!product) {
            throw new Error(`Product not found for SKU: ${item.sku_number}`);
          }
          return {
            ...item,
            name: product.p_name,
            unit_price: getUnitPriceForPack(product, item.pack_type),
            product_category: product.p_category
              ? product.p_category.product_category
              : "Other", // Use the category name
            hsn: product.p_category ? product.p_category.hsn_number : "",
            image_urls: product.image_urls,
          };
        })
      );

      const payload = {
        order_id: String(body.order_id),
        order_date: body.order_date || new Date().toISOString().slice(0, 10),
        order_type: body.order_type || "",
        consignee_name: body.customer.name,
        consignee_phone: Number(body.customer.phone),
        consignee_alternate_phone: body.customer.alternate_phone || "",
        consignee_email: body.customer.email || "",
        consignee_address_line_one: body.customer.address_line_one,
        consignee_address_line_two: body.customer.address_line_two || "",
        consignee_pin_code: Number(body.customer.pincode),
        consignee_city: body.customer.city,
        consignee_state: body.customer.state,
        product_detail: enrichedItems.map((i) => ({
          name: i.name,
          sku_number: i.sku_number || "NA",
          quantity: Number(i.quantity),
          discount: i.discount || "",
          hsn: i.hsn || "",
          unit_price: Number(i.unit_price),
          product_category: i.product_category || "Other",
        })),
        payment_type: body.payment_type.toUpperCase(),
        cod_amount:
          body.payment_type.toUpperCase() === "COD"
            ? String(body.cod_amount)
            : "",
        warehouse_id: warehouse.id, // Moved warehouse_id to be always present
        gst_ewaybill_number: body.gst_ewaybill_number || "",
        gstin_number: body.gstin_number || "",
      };

      // Conditionally add shipping parameters based on package type
      if (body.type_of_package === "MPS") {
        payload.type_of_package = "MPS";
        payload.dimensions = body.dimensions;
        // Calculate total weight from dimensions for MPS orders
        payload.weight = body.dimensions.reduce((acc, dim) => {
            return acc + (Number(dim.no_of_box) * Number(dim.weight_per_box));
        }, 0);
      } else {
        payload.weight = Number(body.weight);
        payload.length = Number(body.length_cm || 0);
        payload.width = Number(body.width_cm || 0);
        payload.height = Number(body.height_cm || 0);
      }

      // DIAGNOSTIC: Enforce a minimum weight of 100g
      if (payload.weight < 100) {
        console.log(`Weight ${payload.weight}g is below minimum, setting to 100g for Shipmozo.`);
        payload.weight = 100;
      }
      
      console.log(
        "3. Built Shipmozo Payload:",
        JSON.stringify(payload, null, 2)
      );

      console.log("4. Calling Shipmozo /push-order...");
      const shipmozoResponse = await axiosInstance.post(
        "/push-order",
        payload
      );
      const resBody = shipmozoResponse.data;
      console.log("5. Shipmozo Response:", JSON.stringify(resBody, null, 2));

      // If Shipmozo failed
      if (resBody.result !== "1") {
        console.log("Error: Shipmozo order creation failed.");
        return res.status(500).json({
          error: "Shipmozo order creation failed",
          details: resBody,
        });
      }

      // Extract AWB
      const awb = resBody.data?.awb_number || "";
      console.log("6. Extracted AWB:", awb);

      console.log("7. Saving order to database...");
      // Save in DB
      const createdOrder = await orderService.create({
        order_id: body.order_id,
        awb_number: awb,
        status: "CREATED",
        order_date: payload.order_date,
        order_type: payload.order_type,
        customer: body.customer,
        items: enrichedItems,
        payment_type: body.payment_type.toUpperCase(),
        cod_amount: Number(body.cod_amount) || 0,
        prepaid_amount: Number(body.prepaid_amount) || 0,
        weight_grams: payload.weight, // This will be undefined for MPS
        length_cm: payload.length,   // This will be undefined for MPS
        width_cm: payload.width,     // This will be undefined for MPS
        height_cm: payload.height,   // This will be undefined for MPS
        dimensions: payload.dimensions, // This will be undefined for single package
        warehouse_id: warehouse.id,
        shipmozo_create_response: resBody,
        coupon_code: appliedCouponFromFrontend?.code, // Store applied coupon code
      });
      console.log("8. Order saved to database:", createdOrder._id);

      // Send confirmation email
      emailService.sendOrderConfirmation(createdOrder);

      // 9. Update coupon usage if a coupon was applied
      if (appliedCouponFromFrontend?._id) {
        try {
          const coupon = await Coupon.findById(appliedCouponFromFrontend._id);
          if (coupon) {
            // Increment usage_count if there's a limit
            if (coupon.usage_limit !== null && coupon.usage_count < coupon.usage_limit) {
              coupon.usage_count += 1;
            } else if (coupon.usage_limit !== null && coupon.usage_count >= coupon.usage_limit) {
              console.warn(`Coupon ${coupon.code} exceeded its global usage limit but was still applied. This should have been caught earlier.`);
            }

            // Update per_user_limit if applicable
            if (coupon.per_user_limit !== null) {
              const customerPhoneNumber = String(body.customer.phone);
              const userUsageCount = coupon.used_phone_numbers.filter(
                (phone) => phone === customerPhoneNumber
              ).length;

              if (userUsageCount < coupon.per_user_limit) {
                coupon.used_phone_numbers.push(customerPhoneNumber);
              } else {
                console.warn(`Coupon ${coupon.code} exceeded per-user limit for phone ${customerPhoneNumber} but was still applied. This should have been caught earlier.`);
              }
            }
            await coupon.save();
            console.log(`9. Coupon ${coupon.code} usage updated.`);
          }
        } catch (couponUpdateErr) {
          console.error("Error updating coupon usage:", couponUpdateErr);
          // Log the error but do not prevent order creation from succeeding
        }
      }

      console.log("--- CREATE ORDER END ---");
      return res.json({
        message: "Order created successfully",
        order: createdOrder,
      });
    }
    catch (err) {
      console.error("--- CREATE ORDER FAILED ---");
      console.error("createOrder error:", err); // Log the full error
      return res
        .status(500)
        .json({ error: "Internal server error", details: err.message });
    }
  },

  /**
   * TRACK ORDER
   * 1. Get AWB
   * 2. Call Shipmozo /track-order
   * 3. Save status to DB
   */
  async trackOrder(req, res) {
    try {
      const awb = req.query.awb;
      if (!awb) return res.status(400).json({ error: "awb is required" });

      const order = await Order.findOne({ awb_number: awb });
      if (!order) return res.status(404).json({ error: "Order not found" });

      const axiosInstance = await getAxios();
      const shipmozoResponse = await axiosInstance.get(
        `/track-order?awb_number=${awb}`
      );

      const updated = await orderService.updateTracking(
        order.order_id,
        shipmozoResponse.data
      );

      return res.json({
        message: "Tracking updated",
        tracking: updated,
      });
    } catch (err) {
      console.error("trackOrder error:", err);
      return res
        .status(500)
        .json({ error: "Internal server error", details: err.message });
    }
  },

  /**
   * CANCEL ORDER
   * 1. Update DB (Shipmozo cancellation handled manually by admin)
   */
  async cancelOrder(req, res) {
    try {
      const { order_id } = req.body;

      if (!order_id) {
        return res
          .status(400)
          .json({ error: "order_id required" });
      }

      const updated = await orderService.cancel(order_id);

      return res.json({
        message: "Order cancelled successfully",
        order: updated,
      });
    } catch (err) {
      console.error("cancelOrder error:", err);
      return res
        .status(500)
        .json({ error: "Internal server error", details: err.message });
    }
  },
};

