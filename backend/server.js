import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

//DB connection
import connectDB from './config/db.js';

// Import routes
import userRoutes from './routes/user.route.js';
import projectRoutes from './routes/project.route.js';
import apiRoutes from './routes/api.route.js';
import projectUserRoutes from './routes/projectUser.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();

// Define allowed origins for protected routes
const allowedOrigins = [
  'https://your-frontend.com', // Replace with your real frontend URL
  'http://localhost:5173',    // For local dev
];

// Public CORS (allow all)
const publicCors = cors({
  origin: '*',
  credentials: false,
});

// Protected CORS (only allow dashboard/frontend)
const protectedCors = cors({
  origin: allowedOrigins,
  credentials: true,
});

app.use(express.json());
app.use(cookieParser());

// Public API routes (open to all)
app.use("/api/auth", publicCors, userRoutes);
app.use("/api/project-users", publicCors, projectUserRoutes);

// Protected/admin routes (restricted)
app.use("/api/admin", protectedCors, adminRoutes);
app.use("/api/projects", protectedCors, projectRoutes);
app.use("/api", protectedCors, apiRoutes); // adjust as needed

app.get("/", (req, res) => {
  res.send("Backend is running");
});


app.listen(process.env.PORT || 5001, () => {
  connectDB();
  console.log(`Server is running on port http://localhost:${process.env.PORT || 5001}`);
});