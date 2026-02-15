import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/async.js";
import Review from "../models/Review.js";
import Bootcamp from "../models/Bootcamp.js";


// @desc    Get Reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @access  Public
export const getReviews = asyncHandler(async (req, res, next) => {


    console.log(req.params.bootcampId);
    if (req.params.bootcampId) {
        const reviews = await Review.find({ bootcamp: req.params.bootcampId });
        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        })
    }
    else {

        res.status(200).json(res.advancedResults)
    }

});


// @desc    Get single review
// @route   GET /api/v1/reviews/:id
// @access  Public
export const getReview = asyncHandler(async (req, res, next) => {

    const review = await Review.findById(req.params.id).populate({ path: 'bootcamp', select: 'name description' });

    if (!review) {
        return next(new ErrorResponse(`No review found with the id of ${req.params.id}`), 404);
    }

    res.status(200).json({
        success: true,
        data: review
    })
});

// @desc    Add Review
// @route   POST /api/v1/bootcamp/:bootcampId/reviews
// @access  private
export const addReview = asyncHandler(async (req, res, next) => {

    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`, 404));
    }

    const review = await Review.create(req.body);

    res.status(201).json({
        success: true,
        data: review
    })

});