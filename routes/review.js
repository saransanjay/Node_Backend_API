import express from "express";
import {
    getReviews,
    getReview,
    addReview,
    updateReview,
    deleteReview
} from '../controllers/review.js'

// Import the route protect and authorization
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

// Import for advanced results
import Review from "../models/Review.js";
import advancedResults from "../middleware/advancedResults.js";

router.route('/')
    .get(advancedResults(Review, { path: 'bootcamp', select: 'name description' }), getReviews)
    .post(protect, authorize('user', 'admin'), addReview);


router.route('/:id')
    .get(getReview)
    .put(protect, authorize('user', 'admin'), updateReview)
    .delete(protect, authorize('user', 'admin'), deleteReview);

export default router;