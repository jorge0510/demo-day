const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Review', reviewSchema);
