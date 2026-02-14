import express from "express";
import {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/users.js';
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/auth.js";
import advanceResults from "../middleware/advancedResults.js"
import User from "../models/User.js";



const router = express.Router();
router.use(protect);
router.use(authorize('admin'));

router.route('/').get(advanceResults(User), getUsers).post(createUser);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);



export default router;