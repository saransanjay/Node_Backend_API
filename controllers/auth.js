import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from '../middleware/async.js';
import User from '../models/User.js';
import sendEmail from "../utils/sendEmail.js";
import crypto from 'crypto';


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


// @desc    Update details
// @route   PUT /api/v1/auth/updatedetails
//access    Private
export const updateDetails = asyncHandler(async (req, res, next) => {

    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    }
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user
    })
});


// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
//access    Private
export const updatePassword = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user.id).select('+password');

    if (!await await user.matchPassword(req.body.currentPassword)) {
        return next(new ErrorResponse(`Password is incorrect`, 401))
    }

    user.password = req.body.newPassword;
    await user.save();

    // Create Token and set cookie
    sendTokenResponse(user, 200, res);

});


// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
//access    public
export const forgotPassword = asyncHandler(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorResponse(`There is no user with that email`, 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    //Create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or some else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message
        })
    } catch (error) {
        console.log(error);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse('Email could notbr sent', 500))
    }

    res.status(200).json({
        success: true,
        data: 'Email sent'
    })
});


// @desc    Rset password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
//access    public
export const resetPassword = asyncHandler(async (req, res, next) => {

    //Get hashed token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });

    if (!user) {
        return next(new ErrorResponse(`Invalid token`, 400))
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    // Create Token and set cookie
    sendTokenResponse(user, 200, res);
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