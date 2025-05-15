const cloudinary = require("../middleware/cloudinary");
const Business = require('../models/Business');

// Create a new business
exports.createBusiness = async (req, res) => {
  try {
    // Upload image to cloudinary
    let imageUrl = '';

    if (req.file && req.file.path) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const business = new Business({...req.body, image: imageUrl});
    const savedBusiness = await business.save();
    res.status(201).json(savedBusiness);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Get all businesses v2
exports.getAllBusinesses = async (req, res) => {
  try {
    const { category, zipcode, search, page = 1, limit = 10 } = req.query;

    // Build filterBy object to pass to view
    const filterBy = {};
    if (category) filterBy.category = category;
    if (zipcode) filterBy.zipcode = zipcode;
    if (search) filterBy.search = search;

    // If no filters, return empty result
    if (Object.keys(filterBy).length === 0) {
      return res.render('v2/index', {  user: req.user || null, results: [], filterBy });
    }

    // Build DB query
    const query = {};
    if (filterBy.category) query.category = filterBy.category;
    if (filterBy.zipcode) query.zipCode = { $regex: filterBy.zipcode, $options: 'i' };

    if (filterBy.search) {
      const searchRegex = new RegExp(filterBy.search, 'i');
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
    console.log("im here")
    res.render('v2/index', { user: req.user || null, results: businesses, filterBy });
  } catch (error) {
    res.status(500).send('Server Error');
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

exports.claimBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ error: 'Business not found' });

    const user = req.user;
    const message = req.body.message || '';

    business.claimedBy = {
      userId: user._id,
      name: user.name,
      email: user.email,
      message,
      claimedAt: new Date()
    };

    business.claimed  = true;

    await business.save();
    res.status(200).json({ message: 'Claim submitted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.featureBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ error: 'Business not found' });

    business.featured = true

    await business.save();
    res.status(200).json({ message: 'Featured submitted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
