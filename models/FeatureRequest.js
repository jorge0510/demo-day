const mongoose = require('mongoose');

const featureRequestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  requestedBy: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: String
  }
}, { timestamps: true });

module.exports = mongoose.model('FeatureRequest', featureRequestSchema);