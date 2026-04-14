const inquiryService = require('../services/inquiry.service');
const vendorService = require('../services/vendor.service');
const Inquiry = require('../models/Inquiry.model');
const { successResponse, errorResponse } = require('../utils/response');

const createInquiry = async (req, res) => {
  const { vendor_id, full_name, hotel_name, email, message } = req.body;
  
  if (!vendor_id) {
    return errorResponse(res, 400, 'Vendor ID is required');
  }

  const inquiry = await inquiryService.createInquiry({
    vendor_id,
    user_id: req.user ? req.user.id : null,
    full_name,
    hotel_name,
    email,
    message
  });

  return successResponse(res, 201, 'Enquiry sent successfully', inquiry);
};

const getMyInquiries = async (req, res) => {
  // If user is a vendor, they want to see inquiries sent TO them
  if (req.user.role === 'vendor') {
    const vendorProfile = await vendorService.getVendorProfileById(req.user.id);
    if (!vendorProfile) {
      return successResponse(res, 200, 'No inquiries yet', []);
    }
    const inquiries = await inquiryService.getInquiriesForVendor(vendorProfile._id);
    return successResponse(res, 200, 'Inquiries fetched successfully', inquiries);
  } else {
    // If hotel owner, see inquiries THEY sent
    const inquiries = await inquiryService.getInquiriesFromUser(req.user.id);
    return successResponse(res, 200, 'Your inquiries fetched successfully', inquiries);
  }
};

const replyToInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    if (!message) return errorResponse(res, 400, 'Message cannot be empty');

    // Mongoose documents have .id as a string representation of ._id
    const senderId = req.user.id || req.user._id;

    const updated = await inquiryService.addReply(id, senderId, message, req.user.role);
    if (!updated) {
      console.log(`Reply failed: Inquiry with ID ${id} not found`);
      return errorResponse(res, 404, 'Inquiry not found. It may have been deleted.');
    }

    return successResponse(res, 200, 'Replied successfully', updated);
  } catch (err) {
    console.error('Reply error:', err);
    return errorResponse(res, 500, 'Server error: ' + err.message);
  }
};

module.exports = {
  createInquiry,
  getMyInquiries,
  replyToInquiry,
  deleteInquiry: async (req, res) => {
    try {
      const { id } = req.params;
      const inquiry = await Inquiry.findById(id);
      
      if (!inquiry) {
        return errorResponse(res, 404, 'Inquiry not found');
      }

      // Authorization Check
      let isOwner = false;
      
      if (req.user.role === 'vendor') {
        const vendorProfile = await vendorService.getVendorProfileById(req.user.id);
        if (vendorProfile && inquiry.vendor_id.toString() === vendorProfile._id.toString()) {
          isOwner = true;
        }
      } else {
        if (inquiry.user_id && inquiry.user_id.toString() === req.user.id.toString()) {
          isOwner = true;
        }
      }

      if (!isOwner) {
        return errorResponse(res, 403, 'You are not authorized to delete this chat');
      }

      await inquiryService.deleteInquiry(id);
      return successResponse(res, 200, 'Inquiry deleted successfully');
    } catch (err) {
      return errorResponse(res, 500, 'Server error: ' + err.message);
    }
  },
  deleteReply: async (req, res) => {
    try {
      const { id, replyId } = req.params;
      const inquiry = await Inquiry.findById(id);
      
      if (!inquiry) {
        return errorResponse(res, 404, 'Inquiry not found');
      }

      const reply = inquiry.replies.id(replyId);
      if (!reply) {
        return errorResponse(res, 404, 'Message not found');
      }

      // Only the sender can delete their own message
      if (reply.sender_id.toString() !== req.user.id.toString()) {
        return errorResponse(res, 403, 'You can only delete your own messages');
      }

      await inquiryService.deleteReply(id, replyId);
      return successResponse(res, 200, 'Message deleted successfully');
    } catch (err) {
      return errorResponse(res, 500, 'Server error: ' + err.message);
    }
  },
  markInquiryAsRead: async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await inquiryService.markAsRead(id, req.user.role);
      if (!updated) return errorResponse(res, 404, 'Inquiry not found');
      return successResponse(res, 200, 'Marked as read', updated);
    } catch (err) {
      return errorResponse(res, 500, 'Server error: ' + err.message);
    }
  }
};
