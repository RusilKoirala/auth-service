import brcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateToken } from "../utils/jwt.util.js";
import crypto from 'crypto';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
import dotenv from "dotenv";
dotenv.config();

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

const sendVerificationEmail = async (email, token) => {
  try {
    const sentFrom = new Sender(process.env.FROM_EMAIL, 'AuthService');
    const recipients = [new Recipient(email, email)];
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject('Verify your email address')
      .setHtml(`<h1>Verify your email</h1><p>Click <a href="${verificationUrl}" target="_blank">here</a> to verify your email. This link will expire soon.</p>`)
      .setText(`Verify your email: ${verificationUrl}`);
    await mailerSend.email.send(emailParams);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};


export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash password
    const hashedPassword = await brcrypt.hash(password, 10);
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
      emailVerified: false,
    });
    await newUser.save();
    await sendVerificationEmail(email, verificationToken);
    res.status(201).json({ message: "User registered successfully. Please check your email to verify your account." });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    // Check if token exists and user is already verified
    const user = await User.findOne({ emailVerificationToken: token });
    if (user && user.emailVerified) {
      return res.status(200).json({ message: "Email already verified" });
    }
    // Normal verification flow
    const validUser = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });
    if (!validUser) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }
    validUser.emailVerified = true;
    validUser.emailVerificationToken = undefined;
    validUser.emailVerificationExpires = undefined;
    await validUser.save();
    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const LoginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // Check password
    const isPasswordValid = await brcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // Require email verification
    if (!user.emailVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }
    const token = generateToken(res, user);
    res.status(200).json({ message: "Login successful", user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is stored in req.user by middleware
    const user = await User.findById(userId).select("-password"); // Exclude password from response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const LogoutUser = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: "Logout successful" });
};

export const resendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required.' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found.' });
  if (user.emailVerified) return res.status(400).json({ message: 'Email already verified.' });

  // Rate limit: only allow resend if last token was sent >2min ago
  const now = Date.now();
  if (user.emailVerificationExpires && user.emailVerificationExpires > now) {
    if (user._lastOtpSent && now - user._lastOtpSent < 2 * 60 * 1000) {
      return res.status(429).json({ message: 'Please wait before requesting another OTP.' });
    }
  }

  // Generate new token (6-digit numeric)
  const otpToken = (Math.floor(100000 + Math.random() * 900000)).toString();
  const expires = new Date(now + 15 * 60 * 1000); // 15 min expiry

  user.emailVerificationToken = otpToken;
  user.emailVerificationExpires = expires;
  user._lastOtpSent = now; // Not persisted, but you can add to schema if you want
  await user.save();

  try {
    await sendVerificationEmail(email, otpToken);
    res.json({ message: 'OTP sent successfully.' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ message: 'Failed to send OTP.' });
  }
};