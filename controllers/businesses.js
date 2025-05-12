const Business = require('../models/Business');

// Create a new business
exports.createBusiness = async (req, res) => {
  try {
    const business = new Business(req.body);
    const savedBusiness = await business.save();
    res.status(201).json(savedBusiness);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all businesses with optional filtering and pagination
exports.getAllBusinesses = async (req, res) => {
  try {
    const { category, zipcode, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (zipcode) query.zipCode = { $regex: zipcode, $options: 'i' };

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { city: searchRegex }
      ];
    }

    const businesses = await Business.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json(businesses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single business by ID
exports.getBusinessById = async (req, res) => {
  try {
    const business = await Business.findOne({ _id: req.params.id });
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }
    res.status(200).json(business);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a business by ID
exports.updateBusiness = async (req, res) => {
  try {
    const updated = await Business.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Business not found' });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a business by ID
exports.deleteBusiness = async (req, res) => {
  try {
    const deleted = await Business.findOneAndDelete({ _id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ error: 'Business not found' });
    }
    res.status(200).json({ message: 'Business deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
