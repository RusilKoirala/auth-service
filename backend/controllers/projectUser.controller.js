import ProjectUser from '../models/user.project.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerProjectUser = async (req, res) => {
  const { email, password, name } = req.body;
  const project = req.project; // from middleware

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const existingUser = await ProjectUser.findOne({ project: project._id, email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists in this project" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new ProjectUser({
      project: project._id,
      email,
      password: hashedPassword,
      name,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, projectId: project._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ message: "User registered", token });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const loginProjectUser = async (req, res) => {
  const { email, password } = req.body;
  const project = req.project; // from projectAuthMiddleware

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const user = await ProjectUser.findOne({ project: project._id, email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT token scoped to project and user
    const token = jwt.sign(
      { userId: user._id, projectId: project._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};