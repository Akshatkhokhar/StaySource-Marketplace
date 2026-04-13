const Vendor = require('../models/Vendor.model');

const getVendors = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const vendors = await Vendor.find({ is_approved: true })
    .populate('categories')
    .skip(skip)
    .limit(limit);
    
  const total = await Vendor.countDocuments({ is_approved: true });

  return { vendors, total };
};

const getVendorProfileById = async (userId) => {
  const vendor = await Vendor.findOne({ user_id: userId }).populate('categories');
  return vendor; // Might be null, handle in controller
};

const getVendorById = async (id) => {
  return await Vendor.findById(id).populate('categories').populate('user_id', 'full_name email phone');
};

const createVendor = async (userId, vendorData) => {
  // Check if vendor profile already exists
  const existingVendor = await Vendor.findOne({ user_id: userId });
  if (existingVendor) {
    throw { statusCode: 400, message: 'Bad Request', error: 'Vendor profile already exists for this user' };
  }

  const vendor = await Vendor.create({ ...vendorData, user_id: userId });
  return vendor;
};

const updateVendor = async (userId, vendorId, vendorData) => {
  const vendor = await Vendor.findById(vendorId);
  if (!vendor) {
    throw { statusCode: 404, message: 'Vendor not found', error: 'Vendor with this ID does not exist' };
  }

  // Ensure the user owns this vendor profile
  if (vendor.user_id.toString() !== userId.toString()) {
     throw { statusCode: 403, message: 'Forbidden', error: 'You are not authorized to update this vendor' };
  }

  // Update
  const updatedVendor = await Vendor.findByIdAndUpdate(vendorId, vendorData, { new: true, runValidators: true });
  return updatedVendor;
};

const deleteVendor = async (userId, vendorId) => {
  const vendor = await Vendor.findById(vendorId);
  if (!vendor) {
    throw { statusCode: 404, message: 'Vendor not found', error: 'Vendor with this ID does not exist' };
  }

  if (vendor.user_id.toString() !== userId.toString()) {
     throw { statusCode: 403, message: 'Forbidden', error: 'You are not authorized to delete this vendor' };
  }

  await Vendor.findByIdAndDelete(vendorId);
};

module.exports = {
  getVendors,
  getVendorProfileById,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor
};
