import ErrorResponse from '../middleware/error.js';
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
    res.status(200).json({ success: true, data: user });
});