const express = require('express')
const businessController = require("../controllers/businesses");
const reviewController = require('../controllers/reviews');

const router = express.Router()

// Businesses CRUD
router.post('/', businessController.createBusiness);
router.get('/', businessController.getAllBusinesses);
router.get('/:id', businessController.getBusinessById);
router.put('/:id', businessController.updateBusiness);
router.delete('/:id', businessController.deleteBusiness);



// Reviews CRUD
router.post('/:id/reviews', reviewController.addReview);
router.get('/:id/reviews', reviewController.getReviews);
router.put('/:id/reviews/:reviewIndex', reviewController.updateReview);
router.delete('/:id/reviews/:reviewIndex', reviewController.deleteReview);



module.exports = router