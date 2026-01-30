import Bootcamp from "../models/Bootcamp.js";
import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/async.js";


// Bootcamp 

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
export const getBootcamps = asyncHandler(async (req, res, next) => {

    // Build query
    let query;

    // Copy req.query
    let reqQuery = { ...req.query };

    //Fields to exclude
    const removeFields = ['select', 'sort'];

    // Loop over removeFields and delete then from reqQuery
    removeFields.forEach(param => delete reqQuery[param])

    // Create quert to string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, $lt, $lte, $in)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = Bootcamp.find(JSON.parse(queryStr));

    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort 
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }
    else {

        query = query.sort('-createdAt');

    }

    // Executing query
    const bootcamp = await query;

    res.status(200).json({
        success: true,
        count: bootcamp.length,
        data: bootcamp
    })

});


// @desc Get Single bootcamps
// @route GET /api/v1/bootcamps/:id
// @access Public
export const getBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: bootcamp
    })
})

// @desc Carete new bootcamp
// @route POST /api/v1/bootcamps
// @access Public
export const createBootcamps = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        success: true,
        data: bootcamp
    })

})


// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Public
export const updateBootcamps = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: bootcamp })
})

// @desc Get all bootcamps
// @route DELETE /api/v1/bootcamps/:id
// @access Public
export const deleteBootcamps = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: {} })

})