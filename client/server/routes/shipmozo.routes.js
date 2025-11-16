import express from "express";
import axios from "axios";
import shipmozoConfig from "../config/shipmozo.config.js";

const router = express.Router();

// Create Order + AWB
router.post("/create-order", async (req, res) => {
  try {
    const {
      order_id,
      order_amount,
      payment_mode,
      customer,
      items,
      pickup_address,
    } = req.body;

    // Validate essential user data
    if (!customer || !customer.pincode || !customer.phone) {
      return res.status(400).json({ error: "Customer details incomplete" });
    }

    // Use provided pickup OR fallback to config
    const pickup = {
      address: pickup_address?.address || shipmozoConfig.pickup.address,
      pincode: pickup_address?.pincode || shipmozoConfig.pickup.pincode,
      city: pickup_address?.city || shipmozoConfig.pickup.city,
      state: pickup_address?.state || shipmozoConfig.pickup.state,
      contact_person:
        pickup_address?.contact_person || shipmozoConfig.pickup.name,
      contact_phone:
        pickup_address?.contact_phone || shipmozoConfig.pickup.phone,
    };

    const payload = {
      api_key: shipmozoConfig.apiKey,
      auth_token: shipmozoConfig.authToken,

      order_id,
      order_amount,
      payment_mode, // "COD" or "Prepaid"

      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        pincode: customer.pincode,
        city: customer.city,
        state: customer.state,
      },

      items: items?.map((i) => ({
        name: i.name,
        qty: i.qty,
        price: i.price,
        sku: i.sku ?? "NA",
      })),

      pickup,
    };

    const response = await axios.post(
      `${shipmozoConfig.baseUrl}/order/create`,
      payload
    );

    return res.json(response.data);
  } catch (err) {
    console.error("Shipmozo error:", err?.response?.data || err.message);
    res.status(500).json({
      error: "Failed to create order",
      details: err?.response?.data || err.message,
    });
  }
});

export default router;
