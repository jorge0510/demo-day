const Business = require('../models/Business');

// Add a new review to a business
exports.addReview = async (req, res) => {
  try {
    const { id } = req.params; // Business ID
    const review = req.body;

    const business = await Business.findOne({ id });

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    business.reviewData.push(review);
    await business.save();

    res.status(201).json({ message: 'Review added', review });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all reviews for a business
exports.getReviews = async (req, res) => {
  try {
    const { _id } = req.params;

    const business = await Business.findOne({ _id });

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    res.status(200).json(business.reviewData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a review (by review index)
exports.updateReview = async (req, res) => {
  try {
    const { _id, reviewIndex } = req.params;
    const updatedData = req.body;

    const business = await Business.findOne({ _id });

    if (!business || !business.reviewData[reviewIndex]) {
      return res.status(404).json({ error: 'Review not found' });
    }

    business.reviewData[reviewIndex] = {
      ...business.reviewData[reviewIndex]._doc,
      ...updatedData
    };

    await business.save();

    res.status(200).json({ message: 'Review updated', review: business.reviewData[reviewIndex] });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a review (by review index)
exports.deleteReview = async (req, res) => {
  try {
    const { _id, reviewIndex } = req.params;

    const business = await Business.findOne({ _id });

    if (!business || !business.reviewData[reviewIndex]) {
      return res.status(404).json({ error: 'Review not found' });
    }

    business.reviewData.splice(reviewIndex, 1);
    await business.save();

    res.status(200).json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
