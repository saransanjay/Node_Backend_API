import Bootcamp from "../models/Bootcamp.js";
// Bootcamp 

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
export const getBootcamps = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.find();
        res.status(200).json({
            success: true,
            count: bootcamp.length,
            data: bootcamp
        })
    } catch (error) {
        res.status(400).json({
            success: false
        })
    }
}


// @desc Get Single bootcamps
// @route GET /api/v1/bootcamps/:id
// @access Public
export const getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp) {
            return res.status(400).json({ success: false })
        }

        res.status(200).json({
            success: true,
            data: bootcamp
        })
    } catch (error) {

        next(error);
        // res.status(400).json({ success: false })
    }
}

// @desc Carete new bootcamp
// @route POST /api/v1/bootcamps
// @access Public
export const createBootcamps = async (req, res, next) => {

    try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
            success: true,
            data: bootcamp
        })

    } catch (error) {
        res.status(400).json({
            success: false
        })
    }
}


// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Public
export const updateBootcamps = async (req, res, next) => {

    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!bootcamp) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: bootcamp })

    } catch (error) {
        res.status(400).json({ success: false });
    }
}

// @desc Get all bootcamps
// @route DELETE /api/v1/bootcamps/:id
// @access Public
export const deleteBootcamps = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        if (!bootcamp) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} })

    } catch (error) {
        res.status(400).json({ success: false });
    }
}