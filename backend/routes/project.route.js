import express from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";

import { createProject, listUserProjects } from "../controllers/project.controller.js";

const router = express.Router();

router.post("/create", authMiddleware, createProject);
router.get("/", authMiddleware, listUserProjects);

export default router;
