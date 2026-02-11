import express from 'express'
import {
    getBootcamp,
    getBootcamps,
    createBootcamps,
    updateBootcamps,
    deleteBootcamps,
    bootcampPhotoUpload
} from '../controllers/bootcamps.js'

// Import for advance result 
import Bootcamp from '../models/Bootcamp.js';
import advancedResults from '../middleware/advancedResults.js';


// Include other resource routers
import courseRouter from './courses.js';

// Import the route protect
import { protect } from '../middleware/auth.js';

// Import the route authorization
import { authorize } from '../middleware/auth.js';

const router = express.Router();



// Re-route into other resourse routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

router.route('/')
    .get(advancedResults(Bootcamp, "courses"), getBootcamps)
    .post(protect, authorize('publisher', 'admin'), createBootcamps);

router.route('/:id')
    .get(getBootcamp)
    .put(protect, authorize('publisher', 'admin'), updateBootcamps)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamps);

export default router;