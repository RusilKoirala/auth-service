import express from "express";

import { LoginUser, registerUser, getUserProfile, LogoutUser } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", LoginUser);
router.get("/profile", authMiddleware, getUserProfile);
router.post("/logout", authMiddleware, LogoutUser);

export default router;