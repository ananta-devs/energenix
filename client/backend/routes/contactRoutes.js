const express = require("express");
const router = express.Router();
const { submitContactForm } = require("../controllers/contact");
const { auth } = require("../middleware/auth"); // Assuming you have an auth middleware

router.post("/contact", auth, submitContactForm);

module.exports = router;
