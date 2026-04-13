const vendorService = require('../services/vendor.service');
const User = require('../models/User.model');
const { successResponse, errorResponse } = require('../utils/response');

const getVendors = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const { vendors, total } = await vendorService.getVendors(page, limit);

  return successResponse(res, 200, 'Vendors fetched successfully', vendors, {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  });
};

const getMyProfile = async (req, res) => {
  const vendor = await vendorService.getVendorProfileById(req.user.id);
  if (!vendor) {
      return successResponse(res, 200, 'Profile not found', null);
  }
  
  const savedCount = await User.countDocuments({ saved_vendors: vendor._id });
  
  const vendorObj = vendor.toObject();
  vendorObj.saved_count = savedCount;

  return successResponse(res, 200, 'Profile fetched successfully', vendorObj);
};

const getVendor = async (req, res) => {
  const vendor = await vendorService.getVendorById(req.params.id);
  if (!vendor) {
      return errorResponse(res, 404, 'Vendor not found');
  }
  return successResponse(res, 200, 'Vendor fetched successfully', vendor);
};

const createVendor = async (req, res) => {
  const vendor = await vendorService.createVendor(req.user.id, req.body);
  return successResponse(res, 201, 'Vendor profile created successfully', vendor);
};

const updateVendor = async (req, res) => {
  const vendor = await vendorService.updateVendor(req.user.id, req.params.id, req.body);
  return successResponse(res, 200, 'Vendor profile updated successfully', vendor);
};

const deleteVendor = async (req, res) => {
  await vendorService.deleteVendor(req.user.id, req.params.id);
  return successResponse(res, 200, 'Vendor profile deleted successfully');
};

const toggleSaveVendor = async (req, res) => {
  const user = await User.findById(req.user.id);
  const vendorId = req.params.id;

  const index = user.saved_vendors.indexOf(vendorId);
  if (index === -1) {
    user.saved_vendors.push(vendorId);
    await user.save();
    return successResponse(res, 200, 'Vendor saved successfully', { saved: true });
  } else {
    user.saved_vendors.splice(index, 1);
    await user.save();
    return successResponse(res, 200, 'Vendor removed from saved list', { saved: false });
  }
};

const getSavedVendors = async (req, res) => {
  const user = await User.findById(req.user.id).populate('saved_vendors');
  return successResponse(res, 200, 'Saved vendors fetched successfully', user.saved_vendors);
};

module.exports = {
  getVendors,
  getMyProfile,
  getVendor,
  createVendor,
  updateVendor,
  deleteVendor,
  toggleSaveVendor,
  getSavedVendors
};
