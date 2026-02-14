import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from '../middleware/async.js';
import User from '../models/User.js';


// @desc    Get all Users
// @route   GET /api/v1/auth/users
//access    Private/Admin
export const getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc    Get User
// @route   POST /api/v1/auth/users/:id
//access    Private/Admin
export const getUser = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: user
    });
});


// @desc    Create User
// @route   GET /api/v1/auth/users
//access    Private/Admin
export const createUser = asyncHandler(async (req, res, next) => {

    const user = await User.create(req.body);

    res.status(201).json({
        success: true,
        data: user
    });
});

// @desc    Update User
// @route   PUT /api/v1/auth/users/:id
//access    Private/Admin
export const updateUser = asyncHandler(async (req, res, next) => {
    let user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req, params.id}`, 404))
    }

    user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({
        success: true,
        data: user
    });
});


// @desc    Delete User
// @route   Delete /api/v1/auth/users/:id
//access    Private/Admin
export const deleteUser = asyncHandler(async (req, res, next) => {
    let user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req, params.id}`, 404))
    }

    user = await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: {}
    });
});