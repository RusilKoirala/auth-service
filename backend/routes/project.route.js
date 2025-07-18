import express from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createProject, listUserProjects, getProjectById } from "../controllers/project.controller.js";
import UserProject from '../models/user.project.model.js';

const router = express.Router();

router.post("/create", authMiddleware, createProject);
router.get("/", authMiddleware, listUserProjects);
router.get("/:id", authMiddleware, getProjectById);

// --- Analytics Endpoints ---
router.get('/:id/stats/users-created', authMiddleware, async (req, res) => {
  try {
    const count = await UserProject.countDocuments({ project: req.params.id });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ count: 0, error: 'Failed to fetch users-created count' });
  }
});

router.get('/:id/stats/users-deleted', authMiddleware, async (req, res) => {
  // TODO: Implement real logic if you track deletions, else return 0
  res.json({ count: 0 });
});

router.get('/:id/stats/total-users', authMiddleware, async (req, res) => {
  try {
    const count = await UserProject.countDocuments({ project: req.params.id });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ count: 0, error: 'Failed to fetch total-users count' });
  }
});

router.get('/:id/stats/active-sessions', authMiddleware, async (req, res) => {
  // TODO: Implement real logic for active sessions, else return 0
  res.json({ count: 0 });
});

export default router;
