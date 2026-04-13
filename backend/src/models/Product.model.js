const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  vendor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: String // We can use Number, but String is more flexible for "$850.00" as in the mock
  },
  category: {
    type: String
  },
  status: {
    type: String,
    enum: ['In Stock', 'Low Stock', 'Out of Stock'],
    default: 'In Stock'
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
