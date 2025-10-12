import express from 'express'; 
import { signup , login, logout, updateProfilePic, checkAuth} from '../controllers/auth.controller.js'; 
import    protectedRoute   from  '../middleware/auth.middleware.js'; 

// router object
const router = express.Router();

// routes
router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.put('/update-profile-pic', protectedRoute, updateProfilePic);  // protected route is added here to verify token before updating profile pic
router.get('/check-auth', protectedRoute, checkAuth); // protected route is added here to verify token and get user data


export default router;