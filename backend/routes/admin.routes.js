// routes/admin.routes.js
import express from 'express';
import { listProjectUsers, updateProjectUserRole, deleteProjectUser } from '../controllers/admin.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { projectAuthMiddleware } from '../middlewares/projectAuthMiddleware.js';
import { ownerAuthMiddleware } from '../middlewares/ownerAuth.middleware.js';
import { adminOrOwnerMiddleware } from '../middlewares/adminOrOwner.middleware.js';

const router = express.Router();

// Apply auth and project middlewares globally
router.use(authMiddleware, projectAuthMiddleware);

// Use adminOrOwnerMiddleware for /users
router.get('/users', adminOrOwnerMiddleware, listProjectUsers);

router.patch('/users/:userId/role', ownerAuthMiddleware, updateProjectUserRole);
router.delete('/users/:userId', ownerAuthMiddleware, deleteProjectUser);

export default router;
