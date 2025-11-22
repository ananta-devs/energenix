const express = require("express");
const { getAxios, getToken } = require("../services/shipmozo.service.js");
const shipmozoConfig = require("../config/shipmozo.config.js");

const router = express.Router();

/**
 * Health / info wrapper (GET /info)
 * Calls Shipmozo /info if available, otherwise returns basic info.
 */
router.get("/info", async (req, res) => {
  try {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.get("/info");
    return res.json(response.data);
  } catch (err) {
    // graceful fallback
    return res.json({ service: "shipmozo", baseUrl: shipmozoConfig.baseUrl });
  }
});

/**
 * POST /serviceability
 * Body: { pickup_pincode, delivery_pincode, weight_kg, length_cm, breadth_cm, height_cm }
 */
router.post("/serviceability", async (req, res) => {
  try {
    const { pickup_pincode, delivery_pincode, weight_kg } = req.body;
    if (!pickup_pincode || !delivery_pincode || !weight_kg) {
      return res.status(400).json({ error: "pickup_pincode, delivery_pincode and weight_kg are required" });
    }
    const axiosInstance = await getAxios();
    const payload = {
      pickup_pincode: String(pickup_pincode),
      delivery_pincode: String(delivery_pincode),
      weight: Number(weight_kg),
    };
    const response = await axiosInstance.post("/pincode-serviceability", payload);
    return res.json(response.data);
  } catch (err) {
    console.error("serviceability error:", err?.response?.data || err.message);
    return res.status(500).json({ error: "Serviceability check failed", details: err?.response?.data || err.message });
  }
});

/**
 * POST /rate
 * Body: { pickup_pincode, delivery_pincode, weight_kg, length_cm, breadth_cm, height_cm, cod_amount (optional) }
 */
router.post("/rate", async (req, res) => {
  try {
    const { pickup_pincode, delivery_pincode, weight_kg, length_cm = 0, breadth_cm = 0, height_cm = 0, cod_amount = 0 } = req.body;
    if (!pickup_pincode || !delivery_pincode || !weight_kg) {
      return res.status(400).json({ error: "pickup_pincode, delivery_pincode and weight_kg are required" });
    }
    const axiosInstance = await getAxios();
    const payload = {
      pickup_pincode: String(pickup_pincode),
      delivery_pincode: String(delivery_pincode),
      weight: Number(weight_kg),
      dimensions: {
        length: Number(length_cm),
        breadth: Number(breadth_cm),
        height: Number(height_cm)
      },
      cod_amount: Number(cod_amount)
    };
    const response = await axiosInstance.post("/rate-calculator", payload);
    return res.json(response.data);
  } catch (err) {
    console.error("rate error:", err?.response?.data || err.message);
    return res.status(500).json({ error: "Rate calculation failed", details: err?.response?.data || err.message });
  }
});

/**
 * POST /create-order
 * Expected body (example):
 * {
 *   order_id: "ORDER123",
 *   order_amount: 1200,
 *   payment_mode: "COD" | "Prepaid",
 *   cod_amount: 1200, // required if payment_mode === "COD"
 *   customer: { name, phone, email, address, pincode, city, state },
 *   items: [{ name, qty, price, sku, hsn_code (optional) }],
 *   pickup_address: { name, phone, address, pincode, city, state } // optional, falls back to default
 * }
 */
router.post("/create-order", async (req, res) => {
  try {
    const {
      order_id,
      order_amount,
      payment_mode = "Prepaid",
      cod_amount = 0,
      customer,
      items,
      pickup_address,
      package_details = {},
    } = req.body;

    // Minimal validations
    if (!order_id || !order_amount || !customer || !customer.pincode || !customer.phone) {
      return res.status(400).json({ error: "order_id, order_amount and complete customer details are required" });
    }
    if (payment_mode === "COD" && (!cod_amount || Number(cod_amount) <= 0)) {
      return res.status(400).json({ error: "cod_amount required for COD orders" });
    }

    // Fill pickup using provided or default config
    const pickup = {
      name: pickup_address?.name || shipmozoConfig.pickup.name,
      phone: pickup_address?.phone || shipmozoConfig.pickup.phone,
      address: pickup_address?.address || shipmozoConfig.pickup.address,
      pincode: pickup_address?.pincode || shipmozoConfig.pickup.pincode,
      city: pickup_address?.city || shipmozoConfig.pickup.city,
      state: pickup_address?.state || shipmozoConfig.pickup.state,
    };

    // Build items array in expected format
    const formattedItems = (items || []).map(i => ({
      name: i.name || "Item",
      qty: Number(i.qty || 1),
      price: Number(i.price || 0),
      sku: i.sku || "NA",
      hsn_code: i.hsn_code || ""
    }));

    // Package & dimensions — supply defaults to avoid rejections
    const weightKg = Number(package_details.weight_kg || package_details.weight || 0.5);
    const length = Number(package_details.length_cm || package_details.length || 10);
    const breadth = Number(package_details.breadth_cm || package_details.breadth || 10);
    const height = Number(package_details.height_cm || package_details.height || 10);

    const payload = {
      order_id,
      order_amount: Number(order_amount),
      payment_mode, // "COD" or "Prepaid"
      cod_amount: Number(cod_amount || 0),
      customer: {
        name: customer.name || "",
        phone: String(customer.phone),
        email: customer.email || "",
        address: customer.address || "",
        pincode: String(customer.pincode),
        city: customer.city || "",
        state: customer.state || "",
      },
      items: formattedItems,
      pickup: {
        address: pickup.address,
        pincode: String(pickup.pincode),
        city: pickup.city,
        state: pickup.state,
        contact_person: pickup.name,
        contact_phone: pickup.phone,
      },
      package: {
        weight: weightKg,
        length,
        breadth,
        height,
      },
      // optional flags
      is_invoice_created: req.body.is_invoice_created || false,
      shipping_instructions: req.body.shipping_instructions || "",
    };

    const axiosInstance = await getAxios();
    // Shipmozo documented endpoint for creating shipment is /push-order
    const response = await axiosInstance.post("/push-order", payload);
    return res.json(response.data);
  } catch (err) {
    console.error("create-order error:", err?.response?.data || err.message);
    return res.status(500).json({ error: "Create order failed", details: err?.response?.data || err.message });
  }
});


/**
 * GET /label/:awb
 * Downloads label PDF (returns binary stream). The client should request with `Accept: application/pdf`
 */
router.get("/label/:awb", async (req, res) => {
  try {
    const { awb } = req.params;
    if (!awb) return res.status(400).json({ error: "awb is required" });
    const axiosInstance = await getAxios();
    const response = await axiosInstance.get(`/get-order-label/${encodeURIComponent(awb)}`, { responseType: "arraybuffer" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${awb}.pdf"`);
    return res.send(Buffer.from(response.data));
  } catch (err) {
    console.error("label error:", err?.response?.data || err.message);
    return res.status(500).json({ error: "Label download failed", details: err?.response?.data || err.message });
  }
});


/**
 * GET /track?awb=XXXXX
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

module.exports = router;
