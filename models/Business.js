const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({

  // Business Info
  name: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String },
  address: { type: String, required: true },
  city: { type: String },
  zipCode: { type: String },
  description: { type: String },

  // Details
  hours: {
    Monday: { type: String },
    Tuesday: { type: String },
    Wednesday: { type: String },
    Thursday: { type: String },
    Friday: { type: String },
    Saturday: { type: String },
    Sunday: { type: String }
  },
  amenities: [{ type: String }], // e.g., ["Free WiFi", "Parking"]
  image: { type: String },

  // Contact
  phone: { type: String },
  email: { type: String },
  website: { type: String },
  social: {
    facebook: { type: String },
    instagram: { type: String }
  },

  // System
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  claimed: { type: Boolean, default: false },
  reviewData: { type: [mongoose.Schema.Types.Mixed], default: [] }

}, { timestamps: true });

module.exports = mongoose.model('Business', businessSchema);
