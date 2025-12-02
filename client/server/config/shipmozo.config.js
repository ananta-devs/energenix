// config/shipmozo.config.js
const dotenv = require("dotenv");
dotenv.config();

const shipmozoConfig = {
  // Prefer explicit public/private keys if provided
  publicKey: process.env.SHIPMOZO_PUBLIC_KEY || "",
  privateKey: process.env.SHIPMOZO_PRIVATE_KEY || "",

  // Credentials to fetch keys via /login if public/private not provided
  username: process.env.SHIPMOZO_USERNAME || process.env.SHIPMOZO_EMAIL || "",
  password: process.env.SHIPMOZO_PASSWORD || "",

  // Base URL (no trailing slash)
  baseUrl: (process.env.SHIPMOZO_BASE_URL || "https://shipping-api.com/app/api/v1").replace(/\/$/, ""),

  // Optionally fallback warehouse info (if you want env override)
  warehouseId: process.env.WAREHOUSE_ID || "",
  warehousePincode: process.env.WAREHOUSE_PINCODE || "",

  // Debug logging
  debug: process.env.SHIPMOZO_DEBUG === "1" || false
};

module.exports = shipmozoConfig;
