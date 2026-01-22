import Bootcamp from "../models/Bootcamp.js";
// Bootcamp 

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
export const getBootcamps = (req, res, next) => {
    res.json({ sucess: true, msg: `Show all bootcamps` });
}


// @desc Get Single bootcamps
// @route GET /api/v1/bootcamps/:id
// @access Public
export const getBootcamp = (req, res, next) => {
    res.json({ sucess: true, msg: `Show bootcamp ${req.params.id}` });
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
export const updateBootcamps = (req, res, next) => {
    res.json({ sucess: true, msg: `Update bootcamp ${req.params.id}` });

}

// @desc Get all bootcamps
// @route DELETE /api/v1/bootcamps/:id
// @access Public
export const deleteBootcamps = (req, res, next) => {
    res.json({ sucess: true, msg: `Delete bootcamp ${req.params.id}` });

}