const mongoose = require('mongoose');

const developerContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

module.exports = mongoose.model('DeveloperContact', developerContactSchema);