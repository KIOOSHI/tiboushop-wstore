import express from "express";
import { createUser, 
    getAllUsers, 
    loginUser, 
    logoutCurrentUser,
    getCurrentUserProfile,
    updateCurrentUserProfile,
    deleteUserById,
    getUserById,
    updateUserById} 
    from "../controllers/userController.js";


import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router()


router.route('/').post(createUser).get(authenticate, authorizeAdmin, getAllUsers);//creatng a user



router.post('/auth', loginUser);//login a user 
router.post('/logout', logoutCurrentUser); //loging out the user of now



//admin routes
router
.route('/:id')
.delete(authenticate, authorizeAdmin, deleteUserById)
.get(authenticate, authorizeAdmin, getUserById)
.put(authenticate, authorizeAdmin, updateUserById)

// getting a specific user a specific data
router.route('/profile').get(authenticate, getCurrentUserProfile).put(authenticate, 
    updateCurrentUserProfile)




export default router;