import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/async.js";
import Course from "../models/Course.js";

// Course

// @desc    Get Courses 
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampID/courses
// @access  Public

export const getCourses = asyncHandler(async (req, res, next) => {

    let query;

    console.log('\x1b[31m', req.params.bootcampId);
    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId });
        console.log('\x1b[32m', "in");
    }
    else {
        query = Course.find();
    }

    const courses = await query;

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    })

});