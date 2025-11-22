const dotenv = require("dotenv");
dotenv.config();

const shipmozoConfig = {
  // Use login credentials (recommended) rather than sending api_key in body
  email: process.env.SHIPMOZO_EMAIL || "",
  password: process.env.SHIPMOZO_PASSWORD || "",

  // Fallback base url — adjust if Shipmozo gives you a different base for your account
  baseUrl: process.env.SHIPMOZO_BASE_URL || "https://apiv2.shipmozo.com/api/v1",

  // Optional pickup defaults used when a pickup address is not provided per-order
  pickup: {
    name: process.env.PICKUP_NAME || "",
    phone: process.env.PICKUP_PHONE || "",
    address: process.env.PICKUP_ADDRESS || "",
    pincode: process.env.PICKUP_PINCODE || "",
    city: process.env.PICKUP_CITY || "",
    state: process.env.PICKUP_STATE || "",
  },

  // Token cache settings (seconds before expiry to proactively refresh)
  tokenRefreshBufferSeconds: Number(process.env.SHIPMOZO_TOKEN_BUFFER || 60)
};

module.exports = shipmozoConfig;
