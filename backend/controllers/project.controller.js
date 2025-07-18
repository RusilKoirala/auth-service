import projectModel from '../models/project.model.js';
import crypto from 'crypto';
import generateUniqueApiKey from '../utils/generateApi.js';

export const createProject = async (req, res) => {
  const name = req.body.name;

  try {
    const apiKey = await generateUniqueApiKey(); // ✅ declared properly
    const owner = req.user._id;

    const newProject = new projectModel({
      name,
      owner,
      apiKey
    });

    await newProject.save();
    res.status(201).json({ message: "Project created successfully", project: newProject });

  } catch (error) {
    res.status(500).json({ message: "Failed to create project" });
  }
};

export const getProjectData = async (req, res) => {
  return res.status(200).json({
    projectName: req.project.name,
    ownerEmail: req.user.email,
    message: "API call success"
  });
};

export const getProjectStats = async (req, res) => {
  return res.status(200).json({
    projectName: req.project.name,
    usage: {
      requestsThisMonth: 1234, // Add real data later
      rateLimit: "1000 req/day"
    },
    owner: req.user.email
  });
};

export const rotateProjectKey = async (req, res) => {
  try {
    const newKey = crypto.randomBytes(32).toString('hex');
    req.project.apiKey = newKey;
    await req.project.save();

    return res.status(200).json({
      message: "API key rotated successfully",
      newApiKey: newKey
    });
  } catch (error) {
    console.error("API Key rotation error:", error);
    return res.status(500).json({ message: "Error rotating API key" });
  }
};

// NEW: List all projects for the current user (owner)
export const listUserProjects = async (req, res) => {
  try {
    const projects = await projectModel.find({ owner: req.user._id }).select('name apiKey createdAt updatedAt');
    res.status(200).json({ projects });
  } catch (error) {
    console.error('Error fetching user projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
};

// Get a single project by ID
export const getProjectById = async (req, res) => {
  const { id } = req.params;
  if (!id || id.length !== 24) {
    return res.status(400).json({ message: 'Invalid project ID format.' });
  }
  try {
    const project = await projectModel.findById(id).populate('owner', 'name email');
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }
    res.status(200).json({ project });
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    res.status(500).json({ message: 'Failed to fetch project.' });
  }
};