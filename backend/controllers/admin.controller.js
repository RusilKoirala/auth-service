// controllers/admin.controller.js
import ProjectUser from '../models/user.project.model.js';

export const listProjectUsers = async (req, res) => {
  try {
    const users = await ProjectUser.find({ project: req.project._id }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProjectUserRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  try {
    const user = await ProjectUser.findOne({ _id: userId, project: req.project._id });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated', user: { email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProjectUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const deleted = await ProjectUser.findOneAndDelete({ _id: userId, project: req.project._id });
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
