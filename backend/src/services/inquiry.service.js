const Inquiry = require('../models/Inquiry.model');

const createInquiry = async (inquiryData) => {
  return await Inquiry.create(inquiryData);
};

const getInquiriesForVendor = async (vendorId) => {
  return await Inquiry.find({ vendor_id: vendorId })
    .populate('user_id', 'first_name last_name email')
    .sort({ createdAt: -1 });
};

const getInquiriesFromUser = async (userId) => {
  return await Inquiry.find({ user_id: userId })
    .populate('vendor_id', 'company_name')
    .sort({ createdAt: -1 });
};

module.exports = {
  createInquiry,
  getInquiriesForVendor,
  getInquiriesFromUser,
  addReply: async (inquiryId, senderId, message) => {
    return await Inquiry.findByIdAndUpdate(
      inquiryId,
      { $push: { replies: { sender_id: senderId, message } } },
      { new: true }
    );
  }
};
