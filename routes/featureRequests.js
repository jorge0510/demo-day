const express = require('express');
const router = express.Router();
const featureController = require('../controllers/featureRequests');
const { ensureAuth } = require('../middleware/auth'); // adjust path if needed

// View feature requests page
router.get('/', featureController.viewFeatureRequests);

// Submit a new feature request
router.post('/', ensureAuth, featureController.submitFeatureRequest);

module.exports = router;