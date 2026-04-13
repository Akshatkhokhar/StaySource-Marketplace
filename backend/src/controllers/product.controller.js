const Product = require('../models/Product.model');
const Vendor = require('../models/Vendor.model');
const { successResponse, errorResponse } = require('../utils/response');

const getMyProducts = async (req, res) => {
  const vendorProfile = await Vendor.findOne({ user_id: req.user.id });
  if (!vendorProfile) return successResponse(res, 200, 'No products yet', []);
  
  const products = await Product.find({ vendor_id: vendorProfile._id });
  return successResponse(res, 200, 'Products fetched successfully', products);
};

const createProduct = async (req, res) => {
  const vendorProfile = await Vendor.findOne({ user_id: req.user.id });
  if (!vendorProfile) return errorResponse(res, 400, 'Vendor profile required');
  
  const product = await Product.create({ ...req.body, vendor_id: vendorProfile._id });
  return successResponse(res, 201, 'Product added successfully', product);
};

const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return errorResponse(res, 404, 'Product not found');
  
  // Verify ownership
  const vendorProfile = await Vendor.findOne({ user_id: req.user.id });
  if (product.vendor_id.toString() !== vendorProfile._id.toString()) {
    return errorResponse(res, 403, 'Forbidden');
  }

  await Product.findByIdAndDelete(req.params.id);
  return successResponse(res, 200, 'Product deleted');
};

module.exports = { getMyProducts, createProduct, deleteProduct };
