const express = require("express");
const router = express.Router();
const { submitContactForm } = require("../controllers/contact");
const { optionalAuth } = require("../middleware/auth"); 

router.post("/", optionalAuth, submitContactForm);

module.exports = router;
