const Review = require('../models/Review.model');

const createReview = async (reviewData) => {
  return await Review.create(reviewData);
};

const getReviewsByVendor = async (vendorId) => {
  return await Review.find({ vendor_id: vendorId })
    .populate('user_id', 'first_name last_name')
    .sort({ createdAt: -1 });
};

const getAverageRating = async (vendorId) => {
  const stats = await Review.aggregate([
    { $match: { vendor_id: vendorId } },
    {
      $group: {
        _id: '$vendor_id',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    return {
      rating: Math.round(stats[0].averageRating * 10) / 10,
      count: stats[0].reviewCount
    };
  }
  return { rating: 0, count: 0 };
};

module.exports = {
  createReview,
  getReviewsByVendor,
  getAverageRating
};
