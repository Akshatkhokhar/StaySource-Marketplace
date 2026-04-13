const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  vendor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Prevent multiple reviews from the same user for the same vendor
ReviewSchema.index({ vendor_id: 1, user_id: 1 }, { unique: true });

// Update vendor rating after a review is saved
ReviewSchema.post('save', async function() {
  const Review = this.constructor;
  const stats = await Review.aggregate([
    { $match: { vendor_id: this.vendor_id } },
    {
      $group: {
        _id: '$vendor_id',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Vendor').findByIdAndUpdate(this.vendor_id, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviews_count: stats[0].count
    });
  }
});

module.exports = mongoose.model('Review', ReviewSchema);
