const Contact = require('../models/Contact');
const fs = require('fs');
const path = require('path');
const { Resend } = require('resend');

require('dotenv').config(); 

const resend = new Resend(process.env.RESEND_API_KEY);

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({});
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const replyToContact = async (req, res) => {
  const { to, subject, content, name } = req.body;

  if (!to || !content) {
    return res.status(400).json({ message: 'Email and content are required' });
  }

  try {
    const templatePath = path.join(__dirname, '../templates/replyTemp.html');
    let template = fs.readFileSync(templatePath, 'utf8');

    // Replace placeholders
    template = template.replace('[Customer Name]', name || 'Customer');
    
    // Replace the specific message block placeholder
    const placeholderText = '[Add specific details, answers, or next steps relevant to their inquiry here. Keep it clear and concise.]';
    
    // Use replace with a string. if the template has exact match it works. 
    // If not, we might need a more robust check, but based on file read it should match exactly if we copy it exactly.
    // However, looking at the read output, there might be newlines/spaces.
    // Let's use a regex to be safer for the placeholder.
    // The placeholder in the file is inside a div, on its own line likely.
    // Let's try direct replacement first, if it fails I'll use regex.
    // Actually, to be safe against whitespace variations, I'll use regex.
    const placeholderRegex = /\[Add specific details, answers, or next steps relevant to their inquiry here\. Keep it clear and concise\.\]/s;
    
    if (placeholderRegex.test(template)) {
        template = template.replace(placeholderRegex, content);
    } else {
        // Fallback if regex doesn't match (e.g. if I made a typo in regex string vs file)
        // Try replacing the whole div if we can identify it, or just append.
        // Let's try a simpler replacement if the long one fails, or just use the long string which I copied from the file.
        template = template.replace(placeholderText, content);
    }

    await resend.emails.send({
      from: `EnergeniX <${process.env.EMAIL_USER}>`, // The 'from' email must be a verified domain in Resend
      to: [to], // Resend expects an array for 'to'
      subject: subject || 'Reply from EnergeniX',
      html: template,
    });
    res.json({ message: 'Reply sent successfully' });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
};

module.exports = {
  getContacts,
  deleteContact,
  replyToContact,
};
