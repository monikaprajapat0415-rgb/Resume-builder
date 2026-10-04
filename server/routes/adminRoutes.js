import express from 'express';
import protect, { isAdmin } from '../middlewares/authMiddleware.js';
import { getAllBlogsAdmin, getBlogByIdAdmin, createBlog, updateBlog, deleteBlog } from '../controllers/blogController.js';

const adminRouter = express.Router();

// Every route below requires a logged-in admin.
adminRouter.use(protect, isAdmin);

adminRouter.get('/blogs', getAllBlogsAdmin);
adminRouter.get('/blogs/:id', getBlogByIdAdmin);
adminRouter.post('/blogs', createBlog);
adminRouter.put('/blogs/:id', updateBlog);
adminRouter.delete('/blogs/:id', deleteBlog);

export default adminRouter;
