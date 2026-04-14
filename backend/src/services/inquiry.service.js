const Inquiry = require('../models/Inquiry.model');

const createInquiry = async (inquiryData) => {
  const { vendor_id, user_id, message } = inquiryData;
  
  if (user_id) {
    // Check for existing conversation
    const existing = await Inquiry.findOne({ vendor_id, user_id });
    if (existing) {
      existing.replies.push({
        sender_id: user_id,
        message: message,
        created_at: new Date()
      });
      existing.status = 'pending'; 
      existing.read_by_user = true;
      existing.read_by_vendor = false;
      return await existing.save();
    }
  }
  
  // New inquiry
  const newInquiry = new Inquiry(inquiryData);
  newInquiry.read_by_user = !!user_id;
  newInquiry.read_by_vendor = false;
  return await newInquiry.save();
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
  addReply: async (inquiryId, senderId, message, senderRole) => {
    const update = {
      $push: { replies: { sender_id: senderId, message } }
    };
    
    if (senderRole === 'vendor') {
      update.read_by_vendor = true;
      update.read_by_user = false;
    } else {
      update.read_by_user = true;
      update.read_by_vendor = false;
    }

    return await Inquiry.findByIdAndUpdate(
      inquiryId,
      update,
      { new: true }
    );
  },
  markAsRead: async (inquiryId, role) => {
    const update = {};
    if (role === 'vendor') update.read_by_vendor = true;
    else update.read_by_user = true;
    
    return await Inquiry.findByIdAndUpdate(inquiryId, update, { new: true });
  },
  deleteInquiry: async (id) => {
    return await Inquiry.findByIdAndDelete(id);
  },
  deleteReply: async (inquiryId, replyId) => {
    return await Inquiry.findByIdAndUpdate(
      inquiryId,
      { $pull: { replies: { _id: replyId } } },
      { new: true }
    );
  }
};
