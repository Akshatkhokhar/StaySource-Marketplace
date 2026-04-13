const mongoose = require('mongoose');
const reviewService = require('../services/review.service');
const { successResponse, errorResponse } = require('../utils/response');

const addReview = async (req, res) => {
  try {
    const { vendor_id, rating, comment } = req.body;
    
    if (!vendor_id || !rating || !comment) {
      return errorResponse(res, 400, 'Missing required fields');
    }

    if (req.user.role !== 'hotel_owner') {
      return errorResponse(res, 403, 'Only hotel managers can review vendors');
    }

    const review = await reviewService.createReview({
      vendor_id,
      user_id: req.user._id,
      rating,
      comment
    });

    return successResponse(res, 201, 'Review added successfully', review);
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(res, 400, 'You have already reviewed this vendor');
    }
    return errorResponse(res, 500, 'Server error', error.message);
  }
};

const getVendorReviews = async (req, res) => {
  try {
    const { vendorId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return errorResponse(res, 400, 'Invalid Vendor ID');
    }

    const reviews = await reviewService.getReviewsByVendor(vendorId);
    const stats = await reviewService.getAverageRating(new mongoose.Types.ObjectId(vendorId));
    
    return successResponse(res, 200, 'Reviews fetched successfully', {
      reviews,
      stats
    });
  } catch (error) {
    return errorResponse(res, 500, 'Server error', error.message);
  }
};

module.exports = {
  addReview,
  getVendorReviews
};
