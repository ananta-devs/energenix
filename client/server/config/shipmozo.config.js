import dotenv from "dotenv";
dotenv.config();

const shipmozoConfig = {
  apiKey: process.env.SHIPMOZO_API_KEY,
  authToken: process.env.SHIPMOZO_AUTH_TOKEN,

  baseUrl: process.env.SHIPMOZO_BASE_URL || "https://api.shipmozo.com/v1",

  // Optional defaults
  pickup: {
    name: process.env.PICKUP_NAME,
    phone: process.env.PICKUP_PHONE,
    address: process.env.PICKUP_ADDRESS,
    pincode: process.env.PICKUP_PINCODE,
    city: process.env.PICKUP_CITY,
    state: process.env.PICKUP_STATE,
  }
};

export default shipmozoConfig;
