import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from '../middleware/async.js';
import User from '../models/User.js';


// @desc    Register user
// @route   POST /api/v1/auth/register
//access    public     
export const register = asyncHandler(async (req, res, next) => {

    const { name, email, password, role } = req.body;
    const user = await User.create({
        name, email, password, role
    })
    // Create Token and set cookie
    sendTokenResponse(user, 200, res);
});

// @desc    user login
// @route   POST /api/v1/auth/login
//access    public     
export const login = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body;

    //Validation email & password
    if (!email || !password) {
        return next(new ErrorResponse("Please provide an email and password", 400));
    }
    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }

    //chech if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse(" Invalid credentials", 401));
    }
    // Create Token and set cookie
    sendTokenResponse(user, 200, res);

});

// @desc    Get current logged in user
// @route   POST /api/v1/auth/me
//access    Private
export const getMe = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    })
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
//access    public
export const forgotPassword = asyncHandler(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorResponse(`There is no user with that email`, 404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        data: user
    })
});




//Get token from model , create cookie and send repsonde
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
    })
}