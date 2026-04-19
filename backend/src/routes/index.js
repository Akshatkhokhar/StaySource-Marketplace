const express = require('express');

const authRoutes = require('./auth.routes');
const vendorRoutes = require('./vendor.routes');
const categoryRoutes = require('./category.routes');
const searchRoutes = require('./search.routes');
const inquiryRoutes = require('./inquiry.routes');
const productRoutes = require('./product.routes');
const reviewRoutes = require('./review.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/vendors', vendorRoutes);
router.use('/categories', categoryRoutes);
router.use('/search', searchRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/products', productRoutes);
router.use('/reviews', reviewRoutes);
// Catch-all for undefined API routes
router.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found on this server`
  });
});

module.exports = router;
