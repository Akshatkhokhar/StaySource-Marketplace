const categoryService = require('../services/category.service');
const { successResponse } = require('../utils/response');

const getCategories = async (req, res) => {
  const categories = await categoryService.getAllCategories();
  return successResponse(res, 200, 'Categories fetched successfully', categories);
};

module.exports = {
  getCategories
};
