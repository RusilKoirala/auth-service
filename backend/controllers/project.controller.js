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
    console.log("Error creating project:", error);
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