// routes/admin.routes.js
import express from 'express';
import { listProjectUsers, updateProjectUserRole, deleteProjectUser } from '../controllers/admin.controller.js';
import { projectAuthMiddleware } from '../middlewares/projectAuthMiddleware.js';
import { ownerAuthMiddleware } from '../middlewares/ownerAuth.middleware.js';

const router = express.Router();

router.use(projectAuthMiddleware, ownerAuthMiddleware);

router.get('/users', listProjectUsers);
router.patch('/users/:userId/role', updateProjectUserRole);
router.delete('/users/:userId', deleteProjectUser);

export default router;
