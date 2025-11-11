const Contact = require("../models/Contact");

exports.submitContactForm = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    let fullName;
    if (firstName && lastName) {
      fullName = `${firstName} ${lastName}`;
    } else if (firstName) {
      fullName = firstName;
    }

    if (req.user) {
      const { fullName: userName, email: userEmail, phone: userPhone } = req.user;
      const newContact = new Contact({
        fullName: userName,
        email: userEmail,
        phone: userPhone,
        message,
      });
      await newContact.save();
    } else {
      const newContact = new Contact({
        fullName,
        email,
        phone,
        message,
      });
      await newContact.save();
    }

    res.status(201).json({ message: "Contact form submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
