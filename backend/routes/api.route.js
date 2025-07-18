import express from "express";
import { projectAuthMiddleware } from "../middlewares/projectAuthMiddleware.js";
import { apiKeyRateLimiter } from "../middlewares/rate.limit.js";
import {
  
  getProjectData,
  getProjectStats,
  rotateProjectKey
} from "../controllers/project.controller.js";
const router = express.Router();

router.get('/project-data', apiKeyRateLimiter, projectAuthMiddleware, (req, res) => {
  return res.json({
    projectName: req.project.name,
    ownerEmail: req.user.email, // you can access owner too
    message: "API call success"
  });
});


router.get("/data", projectAuthMiddleware, getProjectData);
router.get("/stats", projectAuthMiddleware, getProjectStats);
router.post("/rotate-key", projectAuthMiddleware, rotateProjectKey);
export default router;