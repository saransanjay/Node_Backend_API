import express from "express";
import {
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
} from '../controllers/courses.js'

// Import the route protect
import { protect } from '../middleware/auth.js';

// Import the route authorization
import { authorize } from '../middleware/auth.js';


const router = express.Router({ mergeParams: true });

// Import for advanced results
import Course from "../models/Course.js";
import advancedResults from "../middleware/advancedResults.js";

router.route('/')
    .get(advancedResults(Course, { path: 'bootcamp', select: 'name description' }), getCourses)
    .post(protect, authorize('publisher', 'admin'), addCourse);

router.route('/:id')
    .get(getCourse)
    .put(protect, authorize('publisher', 'admin'), updateCourse)
    .delete(protect, authorize('publisher', 'admin'), deleteCourse);

export default router;