const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  durationDays: {
    type: Number,
    required: true,
    min: 1,
  },
  itinerary: [{
    type: String,
    required: true,
  }],
  images: [{
    type: String,
    validate: {
      validator: function (v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(v);
      },
      message: props => `${props.value} is not a valid image URL!`
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Package', PackageSchema);
