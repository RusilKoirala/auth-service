// middlewares/ownerAuth.middleware.js
export const ownerAuthMiddleware = (req, res, next) => {
  if (!req.user || !req.project) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  // Fix: handle both populated object and string ID
  const ownerId = req.project.owner && req.project.owner._id
    ? req.project.owner._id.toString()
    : req.project.owner.toString();
  if (ownerId !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden: Only project owner allowed' });
  }
  next();
};
