const Vendor = require('../models/Vendor.model');
const Category = require('../models/Category.model');

const searchVendors = async (queryParams) => {
  const { keyword, category, state, city } = queryParams;
  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 10;
  const skip = (page - 1) * limit;

  let query = { is_approved: true };

  if (keyword) {
    // Use regex for keyword search on both company_name and description
    // $text search can't be combined with $or safely
    const regex = new RegExp(keyword, 'i');
    query.$or = [
      { company_name: { $regex: regex } },
      { description: { $regex: regex } }
    ];
  }

  if (category) {
    const categoryDoc = await Category.findOne({ name: { $regex: new RegExp(`^${category}$`, 'i') } });
    if (categoryDoc) {
      query.categories = categoryDoc._id;
    } else {
      // No matching category, return empty
      return { vendors: [], total: 0, page, limit };
    }
  }

  if (state) {
    query.state = { $regex: new RegExp(state, 'i') };
  }

  if (city) {
    query.city = { $regex: new RegExp(city, 'i') };
  }

  const vendors = await Vendor.find(query)
    .populate('categories')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1, is_featured: -1 });

  const total = await Vendor.countDocuments(query);

  return { vendors, total, page, limit };
};

module.exports = {
  searchVendors
};
