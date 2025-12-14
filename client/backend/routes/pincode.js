const express = require("express");
const router = express.Router();
const NodeCache = require("node-cache");

// 1 day cache (24h)
const cache = new NodeCache({ stdTTL: 86400 });

// Load optimized key-value map
const pincodes = require("../data/pincodes.optimized.json");

// GET /api/pincode/:pin
router.get("/:pin", (req, res) => {
  const pin = req.params.pin.trim();

  // Validate PIN format
  if (!/^[0-9]{6}$/.test(pin)) {
    return res.status(400).json({ error: "Invalid pincode format" });
  }

  // Check cache first
  const cached = cache.get(pin);
  if (cached) {
    return res.json(cached);
  }

  // Lookup directly in JSON (O(1) lookup)
  const match = pincodes[pin];

  if (!match) {
    return res.status(404).json({ error: "Pincode not found" });
  }

  // Store in cache
  cache.set(pin, match);

  // Respond
  res.json(match);
});

module.exports = router;
