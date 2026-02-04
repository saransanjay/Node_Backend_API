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

// router.get("/", (req, res) => {
//     res.json({ sucess: true, msg: `Show all bootcamps` });
// })

// router.get("/:id", (req, res) => {
//     res.json({ sucess: true, msg: `Show bootcamp ${req.params.id}` });
// })

// router.post("/", (req, res) => {
//     res.json({ sucess: true, msg: `Create new bootcamps` });
// })

// router.put("/:id", (req, res) => {
//     res.json({ sucess: true, msg: `Update bootcamp ${req.params.id}` });
// })

// router.delete("/:id", (req, res) => {
//     res.json({ sucess: true, msg: `Delete bootcamp ${req.params.id}` });
// })

export default router;