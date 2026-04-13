const express = require('express');
const { addReview, getVendorReviews } = require('../controllers/review.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', protect, addReview);
router.get('/vendor/:vendorId', getVendorReviews);

module.exports = router;
