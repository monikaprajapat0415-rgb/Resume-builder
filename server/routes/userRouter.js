import express from 'express';
import { getUserById, getUserResumes, loginUser, registerUser, getUserCount,forgotPassword,resetPassword, googleAuth, verifyEmail, resendVerificationEmail } from '../controllers/userController.js';
import protect from '../middlewares/authMiddleware.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

const userRouter = express.Router();
userRouter.post('/register', authLimiter, registerUser);
userRouter.post('/login', authLimiter, loginUser);
// Google signup/login - accepts { credential } (Google ID token) and returns our own JWT
userRouter.post('/google-auth', authLimiter, googleAuth);
userRouter.get('/data',protect, getUserById);
userRouter.get('/resumes',protect, getUserResumes);
// public endpoint for total user count
userRouter.get('/count', getUserCount);

// Controller for forgot password
userRouter.post('/forgot-password', authLimiter, forgotPassword);

// Controller for reset password
userRouter.post('/reset-password/:token', authLimiter, resetPassword);

// Email verification - link sent on signup
userRouter.get('/verify-email/:token', verifyEmail);
userRouter.post('/resend-verification', protect, resendVerificationEmail);

export default userRouter;
