import express from "express";
import {
    getReviews,
    getReview
} from '../controllers/review.js'

// Import the route protect and authorization
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

// Import for advanced results
import Review from "../models/Review.js";
import advancedResults from "../middleware/advancedResults.js";

router.route('/')
    .get(advancedResults(Review, { path: 'bootcamp', select: 'name description' }), getReviews);

router.route('/:id')
    .get(getReview);

export default router;