const express = require("express");
const router = express.Router();
const { addAddress, getAddresses, updateAddress, deleteAddress, setActiveAddress } = require("../controllers/address");
const { auth } = require("../middleware/auth");

router.post("/add", auth, addAddress);
router.get("/", auth, getAddresses);
router.put("/:id", auth, updateAddress);
router.delete("/:id", auth, deleteAddress);
router.patch("/:id/set-active", auth, setActiveAddress);

module.exports = router;
