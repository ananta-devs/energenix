import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

let shiprocketToken = null;

// Function to authenticate and get token
export const getShiprocketToken = async () => {
  if (shiprocketToken) return shiprocketToken;

  try {
    const response = await axios.post("https://apiv2.shiprocket.in/v1/external/auth/login", {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    });

    shiprocketToken = response.data.token;
    console.log("✅ Shiprocket Authenticated");

    // Auto-expire token after ~9 hours (for safety)
    setTimeout(() => {
      shiprocketToken = null;
    }, 9 * 60 * 60 * 1000);

    return shiprocketToken;
  } catch (error) {
    console.error("❌ Shiprocket Login Failed:", error.message);
    throw new Error("Shiprocket authentication failed");
  }
};
