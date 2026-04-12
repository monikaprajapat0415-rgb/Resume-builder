import express from 'express';
import { getUserById, getUserResumes, loginUser, registerUser, getUserCount,forgotPassword,resetPassword } from '../controllers/userController.js';
import protect from '../middlewares/authMiddleware.js';

const userRouter = express.Router();
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/data',protect, getUserById);
userRouter.get('/resumes',protect, getUserResumes);
// public endpoint for total user count
userRouter.get('/count', getUserCount);

// Controller for forgot password
userRouter.post('/forgot-password', forgotPassword);

// Controller for reset password
userRouter.post('/reset-password/:token', resetPassword);

export default userRouter;