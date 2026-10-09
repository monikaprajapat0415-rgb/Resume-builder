import express from 'express';
import multer from 'multer';
import protect, { isAdmin } from '../middlewares/authMiddleware.js';
import { getAllBlogsAdmin, getBlogByIdAdmin, createBlog, updateBlog, deleteBlog } from '../controllers/blogController.js';
import { getAllProductsAdmin, getProductByIdAdmin, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { getStats, getUsers, setUserRole, deleteUser, adjustAtsCredits, setAtsDisabled, getCategories, createCategory, updateCategory, deleteCategory, uploadImage } from '../controllers/adminController.js';
import { getMenuAdmin, createMenuItem, updateMenuItem, deleteMenuItem, reorderMenu, restoreMenuDefaults } from '../controllers/menuController.js';
import { getMessages, getUnreadCount, updateMessage, markAllRead, deleteMessage } from '../controllers/contactController.js';
import { getPagesAdmin, getPageByIdAdmin, createPage, updatePage, resetPage, deletePage } from '../controllers/pageController.js';
import { getSiteContentAdmin, saveSiteContent } from '../controllers/siteContentController.js';

const adminRouter = express.Router();

// Images only, 5 MB max.
const imageUpload = multer({
    storage: multer.diskStorage({}),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => cb(null, /^image\/(png|jpe?g|webp|gif|svg\+xml)$/.test(file.mimetype)),
});

// Every route below requires a logged-in admin.
adminRouter.use(protect, isAdmin);

adminRouter.get('/stats', getStats);

adminRouter.get('/blogs', getAllBlogsAdmin);
adminRouter.get('/blogs/:id', getBlogByIdAdmin);
adminRouter.post('/blogs', createBlog);
adminRouter.put('/blogs/:id', updateBlog);
adminRouter.delete('/blogs/:id', deleteBlog);

adminRouter.get('/products', getAllProductsAdmin);
adminRouter.get('/products/:id', getProductByIdAdmin);
adminRouter.post('/products', createProduct);
adminRouter.put('/products/:id', updateProduct);
adminRouter.delete('/products/:id', deleteProduct);

adminRouter.get('/categories', getCategories);
adminRouter.post('/categories', createCategory);
adminRouter.put('/categories/:id', updateCategory);
adminRouter.delete('/categories/:id', deleteCategory);

adminRouter.get('/menu', getMenuAdmin);
adminRouter.post('/menu', createMenuItem);
adminRouter.put('/menu/reorder', reorderMenu);   // must stay above /menu/:id
adminRouter.post('/menu/restore', restoreMenuDefaults);
adminRouter.put('/menu/:id', updateMenuItem);
adminRouter.delete('/menu/:id', deleteMenuItem);

adminRouter.get('/messages', getMessages);
adminRouter.get('/messages/unread-count', getUnreadCount);
adminRouter.post('/messages/mark-all-read', markAllRead);
adminRouter.patch('/messages/:id', updateMessage);
adminRouter.delete('/messages/:id', deleteMessage);

adminRouter.get('/pages', getPagesAdmin);
adminRouter.get('/pages/:id', getPageByIdAdmin);
adminRouter.post('/pages', createPage);
adminRouter.put('/pages/:id', updatePage);
adminRouter.post('/pages/:id/reset', resetPage);
adminRouter.delete('/pages/:id', deletePage);

adminRouter.get('/site-content', getSiteContentAdmin);
adminRouter.put('/site-content', saveSiteContent);

adminRouter.get('/users', getUsers);
adminRouter.patch('/users/:id/role', setUserRole);
adminRouter.delete('/users/:id', deleteUser);
adminRouter.post('/users/:id/ats-credits', adjustAtsCredits);
adminRouter.patch('/users/:id/ats-disabled', setAtsDisabled);

adminRouter.post('/upload', imageUpload.single('image'), uploadImage);

export default adminRouter;
