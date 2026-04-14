const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
  vendor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional if guest enquiry is allowed, but we usually have logged in users
  },
  full_name: {
    type: String,
    required: true
  },
  hotel_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'replied', 'closed'],
    default: 'pending'
  },
  read_by_user: {
    type: Boolean,
    default: false
  },
  read_by_vendor: {
    type: Boolean,
    default: false
  },
  replies: [{
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    created_at: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', InquirySchema);
