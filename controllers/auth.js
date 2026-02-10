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

    // Create Token 
    const token = user.getSignedJwtToken();

    res.status(200).json({ success: true, token });
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
    // Create Token 
    const token = user.getSignedJwtToken();

    res.status(200).json({ success: true, token });
});