const express = require('express');
const { searchVendors } = require('../controllers/search.controller');

const router = express.Router();

router.get('/vendors', searchVendors);

module.exports = router;
