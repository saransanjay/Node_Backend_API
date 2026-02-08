import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/async.js";
import Course from "../models/Course.js";
import Bootcamp from "../models/Bootcamp.js";

// Course

// @desc    Get Courses 
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public

export const getCourses = asyncHandler(async (req, res, next) => {


    if (req.params.bootcampId) {
        const courses = await Course.find({ bootcamp: req.params.bootcampId });
        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        })
    }
    else {

        res.status(200).json(res.advancedResults)
    }

});

// @desc    Get Course
// @route   GET /api/v1/courses
// @access  Public
export const getCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id).populate({ path: 'bootcamp', select: 'name description' });

    if (!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 404);
    }


    res.status(200).json({
        success: true,
        data: course
    })

});

// @desc    Create Course
// @route   POST /api/v1/bootcamp/:bootcampId/courses
// @access  private
export const addCourse = asyncHandler(async (req, res, next) => {

    req.body.bootcamp = req.params.bootcampId;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`, 404));
    }
    const course = await Course.create(req.body);

    res.status(200).json({
        success: true,
        data: course
    })

});

// @desc    Update Course
// @route   PUT /api/v1/courses/:id
// @access  private
export const updateCourse = asyncHandler(async (req, res, next) => {

    let course = await Course.findById(req.params.id);

    console.log(req.body);

    if (!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 404);
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: course
    })

});

// @desc    Delete Course
// @route   DELETE /api/v1/courses/:id
// @access  private
export const deleteCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id);

    if (!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 404);
    }

    await Course.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    })

});