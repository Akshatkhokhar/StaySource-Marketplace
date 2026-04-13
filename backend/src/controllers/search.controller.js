const searchService = require('../services/search.service');
const { successResponse } = require('../utils/response');

const searchVendors = async (req, res) => {
  const { vendors, total, page, limit } = await searchService.searchVendors(req.query);

  return successResponse(res, 200, 'Search completed successfully', vendors, {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  });
};

module.exports = {
  searchVendors
};
