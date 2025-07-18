// middlewares/projectUserAuth.middleware.js
import jwt from 'jsonwebtoken';
import ProjectUser from '../models/user.project.model.js';

export const projectUserAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user and verify project association
    const user = await ProjectUser.findOne({ _id: decoded.userId, project: decoded.projectId });
    if (!user) {
      return res.status(401).json({ message: 'Invalid token user' });
    }

    req.projectUser = user;
    req.project = { _id: decoded.projectId }; // Minimal project info

    next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
