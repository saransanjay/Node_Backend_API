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


const router = express.Router();

// Re-route into other resourse routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/:id/photo').put(bootcampPhotoUpload);

router.route('/')
    .get(advancedResults(Bootcamp, "courses"), getBootcamps)
    .post(createBootcamps);

router.route('/:id')
    .get(getBootcamp)
    .put(updateBootcamps)
    .delete(deleteBootcamps);

export default router;