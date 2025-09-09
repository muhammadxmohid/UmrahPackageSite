const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: /^\S+@\S+\.\S+$/,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
  },
  message: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true,
  }
}, { timestamps: { createdAt: true, updatedAt: false } });

module.exports = mongoose.model('Inquiry', InquirySchema);
