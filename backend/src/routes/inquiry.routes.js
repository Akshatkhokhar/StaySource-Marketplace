const express = require('express');
const { createInquiry, getMyInquiries, replyToInquiry, deleteInquiry, deleteReply, markInquiryAsRead } = require('../controllers/inquiry.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', (req, res, next) => {
    // Optional auth: if user is logged in, use their ID, otherwise allow guest RFQ
    if (req.headers.authorization) {
        return protect(req, res, next);
    }
    next();
}, createInquiry);

router.get('/my', protect, getMyInquiries);
router.post('/:id/reply', protect, replyToInquiry);
router.delete('/:id', protect, deleteInquiry);
router.delete('/:id/messages/:replyId', protect, deleteReply);
router.patch('/:id/read', protect, markInquiryAsRead);

module.exports = router;
