const mongoose = require('mongoose');
const { Schema } = mongoose;

const faqSchema = new Schema({
  business: {
    type: Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  reply: {
    type: String,
    default: null,
    trim: true
  },
  email: {
    type: String,
    default: null,
    trim: true
  },
  source: {
    type: String,
    enum: ['AI', 'owner', 'user'],
    default: 'AI'
  },
  approved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  repliedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('FAQ', faqSchema);