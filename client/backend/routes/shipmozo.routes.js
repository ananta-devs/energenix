// routes/shipmozo.routes.js
const express = require("express");
const { getAxios, getWarehouse } = require("../services/shipmozo.service.js");

const router = express.Router();

/**
 * POST /serviceability
 * Client sends only { delivery_pincode }.
 * Server fetches pickup_pincode from cached warehouse and calls Shipmozo /pincode-serviceability.
 */
router.post("/serviceability", async (req, res) => {
  try {
    const { delivery_pincode } = req.body;
    if (!delivery_pincode) {
      return res.status(400).json({ error: "delivery_pincode is required" });
    }

    const warehouse = await getWarehouse();
    if (!warehouse || !warehouse.pincode) {
      return res.status(500).json({ error: "Pickup pincode not available. Ensure warehouse exists or set WAREHOUSE_ID/WAREHOUSE_PINCODE in env." });
    }

    const axiosInstance = await getAxios();
    const payload = {
      pickup_pincode: Number(warehouse.pincode),
      delivery_pincode: Number(delivery_pincode)
    };

    const response = await axiosInstance.post("/pincode-serviceability", payload);
    return res.json(response.data);
  } catch (err) {
    console.error("serviceability error:", err?.response?.data || err.message);
    return res.status(500).json({ error: "Serviceability check failed", details: err?.response?.data || err.message });
  }
});

/**
 * POST /create-order
 * Minimal mapping to Shipmozo /push-order fields (exact names required by API).
 * Expected client payload (example):
 * {
 *  order_id,
 *  order_date (YYYY-MM-DD optional),
 *  order_type,
 *  customer: { name, phone, alternate_phone, email, address_line_one, address_line_two, pincode, city, state },
 *  items: [{ name, sku_number, quantity, discount, hsn, unit_price, product_category }],
 *  payment_type: "PREPAID" | "COD",
 *  cod_amount (if COD),
 *  weight_kg,
 *  length_cm, width_cm, height_cm
 * }
 */
router.post("/create-order", async (req, res) => {
  try {
    const {
      order_id,
      order_date,
      order_type,
      customer = {},
      items = [],
      payment_type = "PREPAID",
      cod_amount = "",
      weight_kg,
      length_cm,
      width_cm,
      height_cm
    } = req.body;

    if (!order_id) return res.status(400).json({ error: "order_id is required" });
    if (!customer.name || !customer.phone || !customer.pincode) {
      return res.status(400).json({ error: "customer.name, customer.phone and customer.pincode are required" });
    }
    if (weight_kg === undefined || weight_kg === null) {
      return res.status(400).json({ error: "weight_kg is required" });
    }
    if (String(payment_type).toUpperCase() === "COD" && (!cod_amount || Number(cod_amount) <= 0)) {
      return res.status(400).json({ error: "cod_amount required for COD orders" });
    }

    // Build product_detail as required
    const product_detail = (items.length ? items : [{
      name: req.body.item_name || "Item",
      sku_number: req.body.sku || "NA",
      quantity: req.body.quantity || 1,
      discount: req.body.discount || "",
      hsn: req.body.hsn || "",
      unit_price: req.body.unit_price || req.body.price || 0,
      product_category: req.body.product_category || "Other"
    }]).map(i => ({
      name: i.name || "Item",
      sku_number: i.sku_number || i.sku || "NA",
      quantity: Number(i.quantity || i.qty || 1),
      discount: i.discount === undefined ? "" : String(i.discount),
      hsn: i.hsn || i.hsn_code || "",
      unit_price: Number(i.unit_price || i.price || 0),
      product_category: i.product_category || "Other"
    }));

    // Ensure we have a warehouse_id (from cached warehouse)
    const warehouse = await getWarehouse();
    if (!warehouse || !warehouse.id) {
      return res.status(500).json({ error: "warehouse_id not available. Ensure warehouses exist in Shipmozo or set WAREHOUSE_ID in env." });
    }

    const payload = {
      order_id: String(order_id),
      order_date: order_date || new Date().toISOString().slice(0, 10),
      order_type: order_type || "",
      consignee_name: customer.name,
      consignee_phone: Number(customer.phone),
      consignee_alternate_phone: customer.alternate_phone || customer.alt_phone || "",
      consignee_email: customer.email || "",
      consignee_address_line_one: customer.address_line_one || customer.address || "",
      consignee_address_line_two: customer.address_line_two || customer.address2 || "",
      consignee_pin_code: Number(customer.pincode),
      consignee_city: customer.city || "",
      consignee_state: customer.state || "",
      product_detail,
      payment_type: String(payment_type).toUpperCase(),
      cod_amount: String(payment_type).toUpperCase() === "COD" ? String(cod_amount) : "",
      weight: Number(Math.round(Number(weight_kg) * 1000)), // grams per PDF
      length: Number(length_cm || req.body.length || 10),
      width: Number(width_cm || req.body.width || 10),
      height: Number(height_cm || req.body.height || 10),
      warehouse_id: String(warehouse.id),
      gst_ewaybill_number: req.body.gst_ewaybill_number || "",
      gstin_number: req.body.gstin_number || ""
    };

    const axiosInstance = await getAxios();
    const response = await axiosInstance.post("/push-order", payload);
    return res.json(response.data);
  } catch (err) {
    console.error("create-order error:", err?.response?.data || err.message);
    return res.status(500).json({ error: "Create order failed", details: err?.response?.data || err.message });
  }
});

/**
 * GET /track?awb=GGN...
 * Calls /track-order?awb_number=...
 */
router.get("/track", async (req, res) => {
  try {
    const awb = req.query.awb || req.query.awb_number || req.query.tracking;
    if (!awb) return res.status(400).json({ error: "awb query param required" });

    const axiosInstance = await getAxios();
    const response = await axiosInstance.get(`/track-order?awb_number=${encodeURIComponent(awb)}`);
    return res.json(response.data);
  } catch (err) {
    console.error("track error:", err?.response?.data || err.message);
    return res.status(500).json({ error: "Track failed", details: err?.response?.data || err.message });
  }
});

/**
 * POST /cancel-order
 * Body: { order_id, awb_number }
 */
router.post("/cancel-order", async (req, res) => {
  try {
    const { order_id, awb_number } = req.body;
    if (!order_id || !awb_number) return res.status(400).json({ error: "order_id and awb_number required" });

    const axiosInstance = await getAxios();
    const response = await axiosInstance.post("/cancel-order", { order_id: String(order_id), awb_number });
    return res.json(response.data);
  } catch (err) {
    console.error("cancel-order error:", err?.response?.data || err.message);
    return res.status(500).json({ error: "Cancel failed", details: err?.response?.data || err.message });
  }
});

module.exports = router;
