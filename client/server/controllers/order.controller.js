const orderService = require("../services/order.service");
const { getAxios, getWarehouse } = require("../services/shipmozo.service");
const Product = require("../models/Product");
const Category = require("../models/Category"); // Import Category model

module.exports = {

  async getOrders(req, res) {
    try {
      const orders = await orderService.findAll(req.user.email);
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
   */
  async createOrder(req, res) {
    console.log("--- CREATE ORDER START ---");
    try {
      const body = req.body;
      console.log("1. Received Body:", JSON.stringify(body, null, 2));

      // Check duplicate order_id
      const existing = await orderService.findByOrderId(body.order_id);
      if (existing) {
        console.log("Error: Duplicate order_id");
        return res.status(400).json({ error: "Order already exists with this order_id" });
      }

      console.log("2. Getting warehouse and Axios instance...");
      const warehouse = await getWarehouse();
      const axiosInstance = await getAxios();
      console.log("... Warehouse and Axios instance obtained.");

      // Enrich items with product details from DB
      const enrichedItems = await Promise.all(
        body.items.map(async (item) => {
          const product = await Product.findById(item.sku_number).populate('p_category'); // Populate p_category
          if (!product) {
            throw new Error(`Product not found for SKU: ${item.sku_number}`);
          }
          return {
            ...item,
            name: product.p_name,
            unit_price: product.discount_price || product.p_price,
            product_category: product.p_category ? product.p_category.product_category : "Other", // Use the category name
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
        product_detail: enrichedItems.map(i => ({
          name: i.name,
          sku_number: i.sku_number || "NA",
          quantity: Number(i.quantity),
          discount: i.discount || "",
          hsn: i.hsn || "",
          unit_price: Number(i.unit_price),
          product_category: i.product_category || "Other"
        })),
        payment_type: body.payment_type.toUpperCase(),
        cod_amount: body.payment_type.toUpperCase() === "COD" ? String(body.cod_amount) : "",
        weight: Math.round(Number(body.weight_kg) * 1000),
        length: Number(body.length_cm || 10),
        width: Number(body.width_cm || 10),
        height: Number(body.height_cm || 10),
        warehouse_id: warehouse.id,
        gst_ewaybill_number: body.gst_ewaybill_number || "",
        gstin_number: body.gstin_number || ""
      };
      console.log("3. Built Shipmozo Payload:", JSON.stringify(payload, null, 2));

      console.log("4. Calling Shipmozo /push-order...");
      const shipmozoResponse = await axiosInstance.post("/push-order", payload);
      const resBody = shipmozoResponse.data;
      console.log("5. Shipmozo Response:", JSON.stringify(resBody, null, 2));

      // If Shipmozo failed
      if (resBody.result !== "1") {
        console.log("Error: Shipmozo order creation failed.");
        return res.status(500).json({
          error: "Shipmozo order creation failed",
          details: resBody
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
        cod_amount: body.cod_amount || 0,
        weight_grams: payload.weight,
        length_cm: payload.length,
        width_cm: payload.width,
        height_cm: payload.height,
        warehouse_id: warehouse.id,
        shipmozo_create_response: resBody
      });
      console.log("8. Order saved to database:", createdOrder._id);

      console.log("--- CREATE ORDER END ---");
      return res.json({
        message: "Order created successfully",
        order: createdOrder
      });

    } catch (err) {
      console.error("--- CREATE ORDER FAILED ---");
      console.error("createOrder error:", err); // Log the full error
      return res.status(500).json({ error: "Internal server error", details: err.message });
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
      const shipmozoResponse = await axiosInstance.get(`/track-order?awb_number=${awb}`);

      const updated = await orderService.updateTracking(order.order_id, shipmozoResponse.data);

      return res.json({
        message: "Tracking updated",
        tracking: updated
      });

    } catch (err) {
      console.error("trackOrder error:", err);
      return res.status(500).json({ error: "Internal server error", details: err.message });
    }
  },

  /**
   * CANCEL ORDER
   * 1. Call Shipmozo /cancel-order
   * 2. Update DB
   */
  async cancelOrder(req, res) {
    try {
      const { order_id, awb_number } = req.body;

      if (!order_id || !awb_number) {
        return res.status(400).json({ error: "order_id and awb_number required" });
      }

      const axiosInstance = await getAxios();
      const shipmozoResponse = await axiosInstance.post("/cancel-order", {
        order_id,
        awb_number
      });

      const updated = await orderService.cancel(order_id);

      return res.json({
        message: "Order cancelled successfully",
        shipmozo: shipmozoResponse.data,
        order: updated
      });

    } catch (err) {
      console.error("cancelOrder error:", err);
      return res.status(500).json({ error: "Internal server error", details: err.message });
    }
  }
};
