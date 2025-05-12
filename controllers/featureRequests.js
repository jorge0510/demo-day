const FeatureRequest = require('../models/FeatureRequest');

exports.viewFeatureRequests = async (req, res) => {
  try {
    const features = await FeatureRequest.find().sort({ createdAt: -1 });
    res.render('featureRequests', { user: req.user, features });
  } catch (error) {
    res.status(500).send('Failed to load feature requests.');
  }
};

exports.submitFeatureRequest = async (req, res) => {
  try {
    const { title, description } = req.body;
    await FeatureRequest.create({
      title,
      description,
      requestedBy: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
      }
    });
    res.redirect('/featureRequests');
  } catch (error) {
    res.status(400).send('Failed to submit feature request.');
  }
};