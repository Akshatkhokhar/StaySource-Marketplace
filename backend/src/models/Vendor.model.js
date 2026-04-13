const mongoose = require('mongoose');
const { Schema } = mongoose;

const VendorSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  company_name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  street_name: String,
  number: String,
  area: String,
  district: String,
  city: String,
  state: String,
  country: String,
  phone: String,
  email: String,
  website: String,
  linkedin_url: String,
  facebook_url: String,
  contact_salutation: String,
  contact_first_name: String,
  contact_middle_name: String,
  contact_last_name: String,
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }],
  is_featured: {
    type: Boolean,
    default: false
  },
  is_approved: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0
  },
  reviews_count: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

VendorSchema.index({ company_name: 'text' });
VendorSchema.index({ city: 1, state: 1 });
VendorSchema.index({ is_approved: 1 });

module.exports = mongoose.model('Vendor', VendorSchema);
