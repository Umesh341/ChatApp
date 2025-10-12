import express from 'express';
import protectedRoute from '../middleware/auth.middleware.js';
import { getUsersForSidebar, getMessages, sendMessage } from '../controllers/message.controller.js';


// router object
const router = express.Router();

// routes
router.get("/users", protectedRoute,getUsersForSidebar)
router.get("/:id",protectedRoute, getMessages);
router.post("/send/:id",protectedRoute, sendMessage);

export default router;