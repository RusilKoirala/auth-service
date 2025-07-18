import express from 'express';
import { registerProjectUser , loginProjectUser, verifyProjectUserEmail, resendProjectUserOtp } from '../controllers/projectUser.controller.js';
import { projectAuthMiddleware } from '../middlewares/projectAuthMiddleware.js';
import { projectUserAuthMiddleware } from '../middlewares/projectUserAuth.middleware.js';

const router = express.Router();

router.post('/register', projectAuthMiddleware, registerProjectUser);
router.post('/login', projectAuthMiddleware, loginProjectUser);
router.get('/verify-email/:token', verifyProjectUserEmail);
router.post('/resend-otp', resendProjectUserOtp);
router.get('/profile', projectUserAuthMiddleware, (req, res) => {
  res.json({ email: req.projectUser.email, role: req.projectUser.role });
});

export default router;
