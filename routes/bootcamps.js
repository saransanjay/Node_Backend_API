import express from 'express'
import {
    getBootcamp,
    getBootcamps,
    createBootcamps,
    updateBootcamps,
    deleteBootcamps
} from '../controllers/bootcamps.js'

// Include other resource routers
import courseRouter from './courses.js';


const router = express.Router();

// Re-route into other resourse routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/')
    .get(getBootcamps)
    .post(createBootcamps);

router.route('/:id')
    .get(getBootcamp)
    .put(updateBootcamps)
    .delete(deleteBootcamps);

export default router;