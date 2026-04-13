const express = require('express');
const { getMyProducts, createProduct, deleteProduct } = require('../controllers/product.controller');
const { protect } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');

const router = express.Router();

router.get('/my', protect, requireRole('vendor'), getMyProducts);
router.post('/', protect, requireRole('vendor'), createProduct);
router.delete('/:id', protect, requireRole('vendor'), deleteProduct);

module.exports = router;
