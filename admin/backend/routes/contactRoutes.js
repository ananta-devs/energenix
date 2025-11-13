const express = require('express');
const router = express.Router();
const { getContacts, deleteContact } = require('../controllers/contactController');

router.get('/', getContacts);
router.delete('/:id', deleteContact);

module.exports = router;
