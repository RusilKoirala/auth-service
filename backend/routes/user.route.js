import express from "express";
import { LoginUser, registerUser, getUserProfile, LogoutUser, verifyEmail, resendOtp } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", LoginUser);
router.get("/profile", authMiddleware, getUserProfile);
router.post("/logout", authMiddleware, LogoutUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-otp", resendOtp);
// Placeholder for refresh token endpoint
router.post("/refresh", (req, res) => res.status(501).json({ message: 'Not implemented yet' }));

export default router;