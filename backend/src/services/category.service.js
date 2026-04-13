const Category = require('../models/Category.model');

const getAllCategories = async () => {
  return await Category.find().sort({ name: 1 });
};

module.exports = {
  getAllCategories
};
