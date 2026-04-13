const express = require('express');
const { body } = require('express-validator');
const { 
  getVendors, 
  getMyProfile, 
  getVendor, 
  createVendor, 
  updateVendor, 
  deleteVendor,
  toggleSaveVendor,
  getSavedVendors
} = require('../controllers/vendor.controller');
const { protect } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');
const { validateRequest } = require('../middlewares/validate.middleware');

const router = express.Router();

const vendorValidation = [
  body('company_name').notEmpty().withMessage('Company name is required'),
  validateRequest
];

// IMPORTANT: /my/profile MUST come before /:id so Express doesn't
// treat "my" as an ObjectId
router.get('/saved/list', protect, getSavedVendors);
router.get('/my/profile', protect, requireRole('vendor'), getMyProfile);

// Public routes
router.get('/', getVendors);
router.get('/:id', getVendor);
router.post('/:id/save', protect, toggleSaveVendor);

// Protected routes (Vendor only)
router.post('/', protect, requireRole('vendor'), vendorValidation, createVendor);
router.put('/:id', protect, requireRole('vendor'), vendorValidation, updateVendor);
router.delete('/:id', protect, requireRole('vendor'), deleteVendor);

module.exports = router;
