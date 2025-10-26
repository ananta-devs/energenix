import express from "express";
import axios from "axios";
import { getShiprocketToken } from "../config/shiprocketConfig.js";

const router = express.Router();

// 🧾 Create Shipment Order
router.post("/create-order", async (req, res) => {
  try {
    const token = await getShiprocketToken();

    const orderPayload = {
      order_id: "ORDER_" + Date.now(),
      order_date: new Date().toISOString(),
      pickup_location: "Primary", // Must be added in your Shiprocket panel
      channel_id: "",
      billing_customer_name: req.body.name,
      billing_last_name: "",
      billing_address: req.body.address,
      billing_city: req.body.city,
      billing_pincode: req.body.pincode,
      billing_state: req.body.state,
      billing_country: "India",
      billing_email: req.body.email,
      billing_phone: req.body.phone,
      order_items: [
        {
          name: req.body.productName,
          sku: "SKU_" + Date.now(),
          units: req.body.quantity,
          selling_price: req.body.price,
        },
      ],
      payment_method: req.body.paymentMethod, // "Prepaid" or "COD"
      sub_total: req.body.price * req.body.quantity,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5,
    };

    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      orderPayload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Shipment creation failed" });
  }
});

// 🚚 Track Shipment by AWB or Order ID
router.get("/track/:awb", async (req, res) => {
  try {
    const token = await getShiprocketToken();
    const response = await axios.get(
      `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${req.params.awb}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    res.json({ success: true, tracking: response.data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Tracking failed" });
  }
});

export default router;
