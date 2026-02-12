const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// POST /reviews/:productId
router.post('/:productId', reviewController.addReview);

module.exports = router;
