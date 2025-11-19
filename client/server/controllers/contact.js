const Contact = require("../models/Contact");

exports.submitContactForm = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    let contactData;

    if (req.user) {
      // User is logged in, use their data
      contactData = {
        fullName: req.user.fullName,
        email: req.user.email,
        phone: req.user.phone,
        message,
      };
    } else {
      // User is not logged in, use form data
      const fullName = `${firstName || ''} ${lastName || ''}`.trim();
      contactData = {
        fullName,
        email,
        phone,
        message,
      };
    }

    const newContact = new Contact(contactData);
    await newContact.save();

    res.status(201).json({ message: "Contact form submitted successfully" });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({ message: "Server error" });
  }
};
