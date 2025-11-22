const axios = require("axios");
const shipmozoConfig = require("../config/shipmozo.config.js");

let cachedToken = null;
let tokenExpiry = 0; // unix timestamp (seconds)

/**
 * Normalize login response to extract token and expiry safely.
 * Shipmozo documentation is inconsistent across versions; we'll try several common keys.
 */
function extractTokenInfo(data) {
  if (!data) return null;
  // common variants
  const token = data.token || data.auth_token || data.access_token || (data.data && (data.data.token || data.data.auth_token));
  const expiresIn = data.expires_in || data.expires || data.ttl || (data.data && (data.data.expires_in || data.data.expires));
  return { token, expiresIn };
}

async function login() {
  // require credentials to be present
  if (!shipmozoConfig.email || !shipmozoConfig.password) {
    throw new Error("Missing Shipmozo credentials. Set SHIPMOZO_EMAIL and SHIPMOZO_PASSWORD in environment.");
  }

  const url = `${shipmozoConfig.baseUrl.replace(/\/$/, "")}/login`;
  const payload = {
    email: shipmozoConfig.email,
    password: shipmozoConfig.password,
  };

  const res = await axios.post(url, payload);
  const info = extractTokenInfo(res?.data || res?.data?.data);
  if (!info || !info.token) {
    throw new Error("Unable to obtain token from Shipmozo login response: " + JSON.stringify(res?.data));
  }
  const now = Math.floor(Date.now() / 1000);
  cachedToken = info.token;
  tokenExpiry = now + (Number(info.expiresIn) || (60 * 60)); // default 1 hour if expiry not provided
  return cachedToken;
}

/**
 * Get a valid token, refreshing automatically when near expiry.
 */
async function getToken() {
  const now = Math.floor(Date.now() / 1000);
  const buffer = Number(shipmozoConfig.tokenRefreshBufferSeconds || 60);
  if (cachedToken && tokenExpiry - buffer > now) {
    return cachedToken;
  }
  // otherwise login again
  return login();
}

/**
 * Create an axios instance with Authorization header attached.
 */
async function getAxios() {
  const token = await getToken();
  const instance = axios.create({
    baseURL: shipmozoConfig.baseUrl.replace(/\/api\/v1\/?$/, "/api/v1"),
    timeout: 20000,
  });
  instance.interceptors.request.use((cfg) => {
    cfg.headers = cfg.headers || {};
    cfg.headers["Authorization"] = `Bearer ${token}`;
    cfg.headers["Content-Type"] = "application/json";
    return cfg;
  });
  return instance;
}

module.exports = { getToken, getAxios };
