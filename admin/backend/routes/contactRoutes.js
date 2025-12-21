const express = require('express');
const router = express.Router();
const { getContacts, deleteContact, replyToContact } = require('../controllers/contactController');

router.get('/', getContacts);
router.delete('/:id', deleteContact);
router.post('/reply', replyToContact);

module.exports = router;
