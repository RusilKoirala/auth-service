import crypto from 'crypto';
import Project from '../models/project.model.js';

async function generateUniqueApiKey() {
  let apiKey;
  let existing;

  do {
    apiKey = crypto.randomBytes(32).toString('hex');
    existing = await Project.findOne({ apiKey }); // Check if already used
  } while (existing); // Keep generating until it's unique

  return apiKey;
}
export default generateUniqueApiKey;