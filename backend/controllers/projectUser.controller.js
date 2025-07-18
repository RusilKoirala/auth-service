import ProjectUser from '../models/user.project.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

const sendProjectVerificationEmail = async (email, token, projectName) => {
  const sentFrom = new Sender(process.env.FROM_EMAIL, projectName || 'AuthService');
  const recipients = [new Recipient(email, email)];
  const verificationUrl = `${process.env.FRONTEND_URL}/project-verify-email?token=${token}&email=${encodeURIComponent(email)}`;
  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject(`Verify your email for project ${projectName}`)
    .setHtml(`<h1>Verify your email for ${projectName}</h1><p>Click <a href=\"${verificationUrl}\" target=\"_blank\">here</a> to verify your email. This link will expire soon.</p>`)
    .setText(`Verify your email: ${verificationUrl}`);
  await mailerSend.email.send(emailParams);
};

export const registerProjectUser = async (req, res) => {
  const { email, password, name } = req.body;
  const project = req.project;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }
  try {
    const existingUser = await ProjectUser.findOne({ project: project._id, email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists in this project" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Email verification
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const newUser = new ProjectUser({
      project: project._id,
      email,
      password: hashedPassword,
      name,
      emailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    });
    await newUser.save();
    await sendProjectVerificationEmail(email, verificationToken, project.name);
    res.status(201).json({ message: "User registered. Please verify your email." });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyProjectUserEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await ProjectUser.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying project user email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resendProjectUserOtp = async (req, res) => {
  const { email, projectId } = req.body;
  if (!email || !projectId) return res.status(400).json({ message: 'Email and projectId are required.' });
  const user = await ProjectUser.findOne({ email, project: projectId });
  if (!user) return res.status(404).json({ message: 'User not found.' });
  if (user.emailVerified) return res.status(400).json({ message: 'Email already verified.' });
  // Rate limit: only allow resend if last token was sent >2min ago
  const now = Date.now();
  if (user.emailVerificationExpires && user.emailVerificationExpires > now) {
    if (user._lastOtpSent && now - user._lastOtpSent < 2 * 60 * 1000) {
      return res.status(429).json({ message: 'Please wait before requesting another OTP.' });
    }
  }
  // Generate new token
  const otpToken = crypto.randomBytes(32).toString('hex');
  const expires = new Date(now + 15 * 60 * 1000);
  user.emailVerificationToken = otpToken;
  user.emailVerificationExpires = expires;
  user._lastOtpSent = now;
  await user.save();
  try {
    await sendProjectVerificationEmail(email, otpToken, user.project.toString());
    res.json({ message: 'OTP sent successfully.' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ message: 'Failed to send OTP.' });
  }
};

export const loginProjectUser = async (req, res) => {
  const { email, password } = req.body;
  const project = req.project;
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
    if (!user.emailVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }
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