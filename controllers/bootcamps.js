import Bootcamp from "../models/Bootcamp.js";
import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/async.js";
import path from "path";

// Bootcamp 

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
export const getBootcamps = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advancedResults)

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
// @access private
export const createBootcamps = asyncHandler(async (req, res, next) => {

    // Add user to req.body
    req.body.user = req.user.id;

    // Check for publisher bootcamp
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

    //If the user is not an admin, they can onyl add one bootcamp
    if (publishedBootcamp && req.user.role !== "admin") {
        return next(new ErrorResponse(`The user with ID ${req.user.id} has already published a bootcamp`));
    }

    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        success: true,
        data: bootcamp
    })

})


// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private
export const updateBootcamps = asyncHandler(async (req, res, next) => {

    let bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is Bootcamp Owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this bootcamp`, 401));
    }

    bootcamp = await Bootcamp.findByIdAndUpdate(req.user.id, req.body, { new: true, runValidators: true });

    res.status(200).json({ success: true, data: bootcamp })
})

// @desc Get all bootcamps
// @route DELETE /api/v1/bootcamps/:id
// @access Private
export const deleteBootcamps = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is Bootcamp Owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this bootcamp`, 401));
    }

    await bootcamp.deleteOne();

    res.status(200).json({ success: true, data: {} })

})

// @desc Upload  photo for bootcamp
// @route PUT /api/v1/bootcamps/:id/photo
// @access Private
export const bootcampPhotoUpload = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);

    // BootcampId validation
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is Bootcamp Owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this bootcamp`, 401));
    }

    // File validation
    if (!req.files) {
        return next(new ErrorResponse(`Please Upload a file`, 400));
    }

    const file = req.files.file;
    console.log(file.mimetype);

    // File type validation mimetype
    if (!file.mimetype.startsWith("image")) {
        return next(new ErrorResponse(`Please Upload a image file`, 400));
    }

    // File size validation
    if (file.size > process.env.MAX_SIZE_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please Upload a image file less than ${process.envMAX_SIZE_FILE_UPLOAD}`, 400));
    }

    // create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    // move the file to public folder
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }
    })


    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name })

    res.status(200).json({ success: true, data: file.name })

})