import Project from '../models/project.model.js';

export const projectAuthMiddleware = async (req, res, next) => {
  const apiKey = req.header('x-api-key'); // Client must send this

  if (!apiKey) {
    return res.status(401).json({ message: 'API key missing' });
  }

  try {
    const project = await Project.findOne({ apiKey }).populate('owner', '-password');

    if (!project) {
      return res.status(401).json({ message: 'Invalid API key' });
    }

    // Attach to request
    req.project = project;
    // req.user = project.owner; // REMOVE THIS LINE

    next();
  } catch (err) {
    console.error("Project API auth error:", err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
