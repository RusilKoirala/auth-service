// middlewares/adminOrOwner.middleware.js
export const adminOrOwnerMiddleware = (req, res, next) => {
  if (!req.user || !req.project) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Check if user is admin
  if (req.user.isAdmin === true) {
    return next();
  }

  // Check if user is project owner (handle both ObjectId and populated object)
  const ownerId = req.project.owner && req.project.owner._id
    ? req.project.owner._id.toString()
    : req.project.owner.toString();

  if (ownerId === req.user._id.toString()) {
    return next();
  }

  return res.status(403).json({ message: 'Forbidden: Admin or Owner only' });
}; 