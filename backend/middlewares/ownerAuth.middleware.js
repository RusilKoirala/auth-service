// middlewares/ownerAuth.middleware.js
export const ownerAuthMiddleware = (req, res, next) => {
  if (!req.user || !req.project) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (req.project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden: Only project owner allowed' });
  }
  next();
};
