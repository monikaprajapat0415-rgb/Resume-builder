import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRouter.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import productRouter from "./routes/productRoutes.js";
import menuRouter from "./routes/menuRoutes.js";
import publicRouter from "./routes/publicRoutes.js";
import { promoteAdminOnStartup } from "./utils/adminEmail.js";


const app = express();
const PORT = process.env.PORT || 3000;

//DB connection
// Promote ADMIN_EMAIL as soon as the database is (or becomes) reachable. Not awaited
// here, so a database that is down never blocks or crashes the server at startup.
mongoose.connection.once('connected', () => {
    promoteAdminOnStartup().catch((e) => console.error('[admin] could not promote ADMIN_EMAIL:', e.message));
});
await connectDB();

// increase request size to allow large resume text payloads (client may send full PDF-extracted text)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 1. PLACE THE CODE HERE (Before Routes)
const allowedOrigins = [
  "https://primeresumeai.com",
  "https://www.primeresumeai.com"
];
// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true
// }));
app.use(cors());// for local testing, allow all origins. In production, consider restricting to allowedOrigins for better security.

app.get('/', (req, res)=> res.send("Server is live..."))

// Quick check from a browser/curl: http://localhost:3000/api/health -> { db: "connected" }
app.get('/api/health', (req, res) => {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    res.status(mongoose.connection.readyState === 1 ? 200 : 503).json({ status: 'ok', db: states[mongoose.connection.readyState] });
});

// While the database is unreachable, fail fast with a readable message instead of
// letting every request hang until Mongoose's 10-second buffering timeout.
app.use('/api', (req, res, next) => {
    if (mongoose.connection.readyState === 1) return next();
    return res.status(503).json({ message: 'Database is not connected. Check MONGODB_URI and your network (for Atlas: IP allow-list), then see the server console.' });
});
app.use('/api/users', userRouter)
app.use('/api/resumes', resumeRouter)
app.use('/api/ai', aiRouter)
app.use('/api/blogs', blogRouter)
app.use('/api/products', productRouter)
app.use('/api/menu', menuRouter)
app.use('/api', publicRouter)
app.use('/api/admin', adminRouter)

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})