import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from '../middleware/async.js';
import User from '../models/User.js';
import jwt from "jsonwebtoken";

// Protect routes
export const protect = asyncHandler(async (req, res, next) => {

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(' ')[1];
    }
    // else if (req.cookies.token) {
    //     token = req.cookies.token;
    // }

    // Make sure token exists
    if (!token) {
        return next(new ErrorResponse("Not authorize to access this route", 401));
    }

    try {
        // verfiy token
        const decode = jwt.decode(token, process.env.JWT_SECRET);
        req.user = await User.findById(decode.id);
        next();
    } catch (error) {
        return next(new ErrorResponse("Not authorize to access this route", 401));

    }
})

// Grand access to specific roles
export const authorize = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403));
        }
        next();
    }
}