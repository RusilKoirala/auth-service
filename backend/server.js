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

//Middleware
app.use(cors({
    origin: "*", // Adjust this to your frontend URL
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", apiRoutes);
app.use('/api/project-users', projectUserRoutes);
app.use('/api/admin', adminRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});


app.listen(process.env.PORT || 5001, () => {
  connectDB();
  console.log(`Server is running on port http://localhost:${process.env.PORT || 5001}`);
});