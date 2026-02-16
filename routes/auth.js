import express from "express";
import {
    register,
    login,
    getMe,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword,
    logout
} from '../controllers/auth.js';
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/me').post(protect, getMe);
router.route('/updatedetails').put(protect, updateDetails);
router.route('/updatePassword').put(protect, updatePassword);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:resettoken').put(resetPassword);


export default router;