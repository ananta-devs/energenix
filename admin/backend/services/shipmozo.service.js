// services/shipmozo.service.js
const axios = require("axios");
const shipmozoConfig = require("../config/shipmozo.config.js");

/**
 * This service:
 * - Ensures public/private keys are available (env or /login)
 * - Creates axios instances with those headers
 * - Auto-fetches warehouses from /get-warehouses and caches the default warehouse id & pincode
 *
 * Caching rules:
 * - cachedKeys: { publicKey, privateKey }
 * - cachedWarehouse: { id, pincode, raw }  // raw is full object from API
 *
 * No background tasks. Keys and warehouses are fetched on-demand (first request).
 */

let cachedKeys = {
  publicKey: shipmozoConfig.publicKey || null,
  privateKey: shipmozoConfig.privateKey || null
};

let loginInProgress = null;

let cachedWarehouse = {
  id: shipmozoConfig.warehouseId || null,
  pincode: shipmozoConfig.warehousePincode || null,
  raw: null
};

async function loginAndCacheKeys() {
  if (cachedKeys.publicKey && cachedKeys.privateKey) return cachedKeys;
  if (loginInProgress) return loginInProgress;

  loginInProgress = (async () => {
    if (!shipmozoConfig.username || !shipmozoConfig.password) {
      loginInProgress = null;
      throw new Error("Missing Shipmozo credentials: set SHIPMOZO_USERNAME (or SHIPMOZO_EMAIL) and SHIPMOZO_PASSWORD or provide public/private keys.");
    }

    const url = `${shipmozoConfig.baseUrl}/login`;
    const payload = {
      username: shipmozoConfig.username,
      password: shipmozoConfig.password
    };

    const res = await axios.post(url, payload, { timeout: 20000 });
    const body = res?.data;
    if (!body) throw new Error("Empty login response from Shipmozo");

    // body.data can be an array with one object, per PDF
    const info = Array.isArray(body.data) && body.data.length > 0 ? body.data[0] : body.data;
    const publicKey = info?.public_key || info?.publicKey || info?.public || null;
    const privateKey = info?.private_key || info?.privateKey || info?.private || null;

    if (!publicKey || !privateKey) {
      throw new Error("Login succeeded but response did not include public_key/private_key: " + JSON.stringify(body));
    }

    cachedKeys.publicKey = publicKey;
    cachedKeys.privateKey = privateKey;
    loginInProgress = null;
    return cachedKeys;
  })();

  return loginInProgress;
}

async function ensureKeys() {
  if (cachedKeys.publicKey && cachedKeys.privateKey) return cachedKeys;
  return loginAndCacheKeys();
}

/**
 * Get an axios instance with public/private keys in headers.
 * This does NOT auto-fetch warehouse.
 */
async function getAxios() {
  const keys = await ensureKeys();
  const instance = axios.create({
    baseURL: shipmozoConfig.baseUrl,
    timeout: 20000,
    headers: {
      "Content-Type": "application/json",
      "public-key": keys.publicKey,
      "private-key": keys.privateKey
    }
  });

  if (shipmozoConfig.debug) {
    instance.interceptors.request.use(cfg => {
      return cfg;
    });
    instance.interceptors.response.use(
      r => { return r; },
      e => { console.error("[Shipmozo Response Error]", e?.response?.status, e?.response?.data || e.message); throw e; }
    );
  }

  return instance;
}

/**
 * Fetch warehouses from Shipmozo, pick default or first active, and cache id + pincode.
 * Called on-demand (first call).
 */
async function fetchAndCacheWarehouse() {
  // If env overrides present, use them
  if (cachedWarehouse.id && cachedWarehouse.pincode) {
    return cachedWarehouse;
  }

  const axiosInstance = await getAxios();
  const res = await axiosInstance.get("/get-warehouses");
  const body = res?.data;
  if (!body || body.result !== "1" || !Array.isArray(body.data)) {
    throw new Error("Failed to fetch warehouses or no warehouses present: " + JSON.stringify(body));
  }

  const warehouses = body.data;

  // Prefer default === "YES"
  let chosen = warehouses.find(w => String(w.default).toUpperCase() === "YES" && String(w.status).toUpperCase() === "ACTIVE");
  if (!chosen) {
    // fallback to first active
    chosen = warehouses.find(w => String(w.status).toUpperCase() === "ACTIVE");
  }
  if (!chosen) {
    // fallback to first entry
    chosen = warehouses[0];
  }
  if (!chosen) {
    throw new Error("No warehouses returned from Shipmozo");
  }

  // Some APIs return pincode field name pincode or pin_code — normalize
  const pincode = chosen.pincode || chosen.pin_code || chosen.pincode || null;
  if (!chosen.id) {
    throw new Error("Warehouse object lacks id: " + JSON.stringify(chosen));
  }

  cachedWarehouse.id = String(chosen.id);
  cachedWarehouse.pincode = pincode ? String(pincode) : null;
  cachedWarehouse.raw = chosen;

  return cachedWarehouse;
}

/**
 * Get cached warehouse, fetching if necessary.
 * If WAREHOUSE_ID and WAREHOUSE_PINCODE were provided in env they take precedence.
 */
async function getWarehouse() {
  // env overrides set at startup via config; if both present, return immediately
  if (shipmozoConfig.warehouseId && shipmozoConfig.warehousePincode) {
    return {
      id: String(shipmozoConfig.warehouseId),
      pincode: String(shipmozoConfig.warehousePincode),
      raw: null
    };
  }

  // if cachedWarehouse already has both id and pincode, return it
  if (cachedWarehouse.id && cachedWarehouse.pincode) {
    return cachedWarehouse;
  }

  // otherwise fetch
  return fetchAndCacheWarehouse();
}

/**
 * Track an order by AWB number.
 */
async function trackOrder(awb) {
  if (!awb) throw new Error("AWB number is required for tracking");
  const axiosInstance = await getAxios();
  const res = await axiosInstance.get(`/track-order?awb_number=${awb}`);
  return res.data;
}

/**
 * Push an order to Shipmozo.
 * @param {Object} payload - The Shipmozo-formatted order payload.
 */
async function pushOrder(payload) {
  const axiosInstance = await getAxios();
  const res = await axiosInstance.post("/push-order", payload);
  return res.data;
}

module.exports = {
  getAxios,
  ensureKeys,
  getWarehouse,
  trackOrder,
  pushOrder,
  // exported for tests or manual refresh if needed
  _internal: {
    _cachedKeys: cachedKeys,
    _cachedWarehouse: cachedWarehouse,
    fetchAndCacheWarehouse,
    loginAndCacheKeys
  }
};
