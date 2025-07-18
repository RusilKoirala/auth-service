# 🚀 Auth0-Clone Development Plan

## 📋 Overview

This document provides a comprehensive step-by-step development plan to complete the Auth0-Clone project from 85% to 100% production-ready. The plan is organized into 5 phases with specific deliverables, code examples, and best practices.

---

## 🎯 Phase 1: UI Polish & UX Improvements (Week 1)

### 1.1 Responsive Design Fixes

#### Mobile Navigation Improvements
```jsx
// frontend/src/components/Navbar.jsx
// Add better mobile menu handling
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

// Improve mobile menu transitions
<div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} 
  absolute top-full left-0 right-0 bg-background border-b border-border 
  shadow-lg transition-all duration-300 ease-in-out`}>
  {/* Mobile menu content */}
</div>
```

#### Form Validation Feedback
```jsx
// frontend/src/components/AuthForm.jsx
// Add real-time validation
const [validationErrors, setValidationErrors] = useState({});

const validateField = (name, value) => {
  const errors = {};
  if (name === 'email' && !value.includes('@')) {
    errors.email = 'Please enter a valid email address';
  }
  if (name === 'password' && value.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  return errors;
};

// Add error display
{validationErrors.email && (
  <p className="text-sm text-destructive mt-1">{validationErrors.email}</p>
)}
```

#### Loading State Animations
```jsx
// frontend/src/components/LoadingSpinner.jsx
export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => (
  <div className="flex items-center justify-center space-x-2">
    <div className={`animate-spin rounded-full border-b-2 border-primary ${
      size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-8 w-8' : 'h-6 w-6'
    }`}></div>
    <span className="text-muted-foreground">{text}</span>
  </div>
);
```

### 1.2 Accessibility Improvements

#### ARIA Labels and Roles
```jsx
// Add to all interactive elements
<button
  aria-label="Toggle password visibility"
  aria-expanded={showPassword}
  role="button"
  onClick={() => setShowPassword(!showPassword)}
>
  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
</button>
```

#### Keyboard Navigation
```jsx
// Add focus management
useEffect(() => {
  if (isMobileMenuOpen) {
    // Trap focus in mobile menu
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };
    
    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }
}, [isMobileMenuOpen]);
```

---

## 🔒 Phase 2: Security Enhancements (Week 2-3)

### 2.1 Email Verification System

#### Backend Implementation
```javascript
// backend/models/user.model.js
const UserSchema = new mongoose.Schema({
  // ... existing fields
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date
});

// backend/utils/emailService.js
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: email,
    subject: 'Verify your email address',
    html: `
      <h1>Welcome to AuthService!</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `
  });
};

// backend/controllers/user.controller.js
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // ... existing validation
    
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires
    });
    
    await newUser.save();
    await sendVerificationEmail(email, verificationToken);
    
    res.status(201).json({ 
      message: "User registered successfully. Please check your email to verify your account." 
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.params;
  
  try {
    const user = await User.findOne({
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
    console.error("Error verifying email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
```

#### Frontend Implementation
```jsx
// frontend/src/pages/VerifyEmail.jsx
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email/${token}`, {
          method: 'POST'
        });
        
        if (response.ok) {
          setStatus('success');
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setStatus('error');
        }
      } catch (error) {
        setStatus('error');
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="card p-8 text-center">
        {status === 'verifying' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Verifying Email</h2>
            <p className="text-muted-foreground">Please wait while we verify your email address...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Email Verified!</h2>
            <p className="text-muted-foreground">Your email has been verified successfully. Redirecting to login...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Verification Failed</h2>
            <p className="text-muted-foreground">The verification link is invalid or has expired.</p>
            <button 
              onClick={() => navigate('/login')}
              className="btn-primary mt-4"
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};
```

### 2.2 Refresh Token Implementation

#### Backend Implementation
```javascript
// backend/models/refreshToken.model.js
import mongoose from 'mongoose';

const RefreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  expiresAt: {
    type: Date,
    required: true
  },
  isRevoked: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model('RefreshToken', RefreshTokenSchema);

// backend/utils/jwt.util.js
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import RefreshToken from '../models/refreshToken.model.js';

export const generateTokens = async (user, projectId = null) => {
  const accessToken = jwt.sign(
    { 
      id: user._id, 
      email: user.email,
      projectId 
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = crypto.randomBytes(40).toString('hex');
  const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await RefreshToken.create({
    token: refreshToken,
    userId: user._id,
    projectId,
    expiresAt: refreshTokenExpiry
  });

  return { accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken) => {
  const tokenDoc = await RefreshToken.findOne({
    token: refreshToken,
    isRevoked: false,
    expiresAt: { $gt: new Date() }
  }).populate('userId');

  if (!tokenDoc) {
    throw new Error('Invalid refresh token');
  }

  const newAccessToken = jwt.sign(
    { 
      id: tokenDoc.userId._id, 
      email: tokenDoc.userId.email,
      projectId: tokenDoc.projectId 
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  return { accessToken: newAccessToken };
};

export const revokeRefreshToken = async (refreshToken) => {
  await RefreshToken.findOneAndUpdate(
    { token: refreshToken },
    { isRevoked: true }
  );
};

// backend/controllers/auth.controller.js
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const { accessToken } = await refreshAccessToken(refreshToken);
    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const logout = async (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    await revokeRefreshToken(refreshToken);
  }

  res.json({ message: 'Logged out successfully' });
};
```

#### Frontend Implementation
```jsx
// frontend/src/context/AuthContext.jsx
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (response.ok) {
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setUser(data.user);
        
        // Store tokens securely
        localStorage.setItem('refreshToken', data.refreshToken);
        sessionStorage.setItem('accessToken', data.accessToken);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw error;
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      const data = await response.json();
      
      if (response.ok) {
        setAccessToken(data.accessToken);
        sessionStorage.setItem('accessToken', data.accessToken);
        return data.accessToken;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      logout();
      throw error;
    }
  };

  const logout = () => {
    if (refreshToken) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      }).catch(console.error);
    }

    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('accessToken');
  };

  // Auto-refresh token when it expires
  useEffect(() => {
    if (accessToken) {
      const tokenExpiry = jwtDecode(accessToken).exp * 1000;
      const timeUntilExpiry = tokenExpiry - Date.now();
      
      if (timeUntilExpiry > 0) {
        const refreshTimeout = setTimeout(refreshAccessToken, timeUntilExpiry - 60000); // Refresh 1 minute before expiry
        return () => clearTimeout(refreshTimeout);
      }
    }
  }, [accessToken]);

  // ... rest of context
};
```

### 2.3 Two-Factor Authentication (2FA)

#### Backend Implementation
```javascript
// backend/models/user.model.js
const UserSchema = new mongoose.Schema({
  // ... existing fields
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: String,
  backupCodes: [String]
});

// backend/utils/twoFactor.js
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export const generateTwoFactorSecret = async (user) => {
  const secret = speakeasy.generateSecret({
    name: `AuthService (${user.email})`,
    issuer: 'AuthService'
  });

  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
  
  return {
    secret: secret.base32,
    qrCodeUrl
  };
};

export const verifyTwoFactorToken = (secret, token) => {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2 // Allow 2 time steps (60 seconds) for clock skew
  });
};

export const generateBackupCodes = () => {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
  }
  return codes;
};

// backend/controllers/twoFactor.controller.js
export const setupTwoFactor = async (req, res) => {
  try {
    const { secret, qrCodeUrl } = await generateTwoFactorSecret(req.user);
    const backupCodes = generateBackupCodes();
    
    // Store secret temporarily (not enabled yet)
    req.user.twoFactorSecret = secret;
    req.user.backupCodes = backupCodes;
    await req.user.save();
    
    res.json({
      secret,
      qrCodeUrl,
      backupCodes
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to setup 2FA' });
  }
};

export const enableTwoFactor = async (req, res) => {
  const { token } = req.body;
  
  try {
    if (!req.user.twoFactorSecret) {
      return res.status(400).json({ message: '2FA not set up' });
    }
    
    const isValid = verifyTwoFactorToken(req.user.twoFactorSecret, token);
    
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid token' });
    }
    
    req.user.twoFactorEnabled = true;
    await req.user.save();
    
    res.json({ message: '2FA enabled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to enable 2FA' });
  }
};

export const verifyTwoFactor = async (req, res) => {
  const { token, backupCode } = req.body;
  
  try {
    if (backupCode) {
      // Verify backup code
      const isValidBackupCode = req.user.backupCodes.includes(backupCode);
      if (!isValidBackupCode) {
        return res.status(400).json({ message: 'Invalid backup code' });
      }
      
      // Remove used backup code
      req.user.backupCodes = req.user.backupCodes.filter(code => code !== backupCode);
      await req.user.save();
    } else {
      // Verify TOTP token
      const isValid = verifyTwoFactorToken(req.user.twoFactorSecret, token);
      if (!isValid) {
        return res.status(400).json({ message: 'Invalid token' });
      }
    }
    
    res.json({ message: '2FA verification successful' });
  } catch (error) {
    res.status(500).json({ message: '2FA verification failed' });
  }
};
```

---

## 🧪 Phase 3: Testing Implementation (Week 3-4)

### 3.1 Backend Testing Setup

#### Jest Configuration
```javascript
// backend/jest.config.js
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/index.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};

// backend/tests/setup.js
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});
```

#### Authentication Tests
```javascript
// backend/tests/auth.test.js
import request from 'supertest';
import app from '../server.js';
import User from '../models/user.model.js';

describe('Authentication', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe('User registered successfully');
      
      const user = await User.findOne({ email: userData.email });
      expect(user).toBeTruthy();
      expect(user.emailVerified).toBe(false);
    });

    it('should not register user with existing email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      await User.create(userData);

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toBe('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10)
      });
    });

    it('should login user with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should not login with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(400);

      expect(response.body.message).toBe('Invalid email or password');
    });
  });
});
```

### 3.2 Frontend Testing Setup

#### React Testing Library Configuration
```javascript
// frontend/vitest.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
    css: true
  }
});

// frontend/src/tests/setup.js
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock fetch globally
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.sessionStorage = sessionStorageMock;
```

#### Component Tests
```jsx
// frontend/src/components/__tests__/AuthForm.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthForm } from '../AuthForm';
import { AuthProvider } from '../../context/AuthContext';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('AuthForm', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should render login form by default', () => {
    renderWithProviders(<AuthForm />);
    
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should switch to register form when toggled', () => {
    renderWithProviders(<AuthForm />);
    
    const toggleButton = screen.getByText(/create account/i);
    fireEvent.click(toggleButton);
    
    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('should handle login submission', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'mock-token', user: mockUser })
    });

    renderWithProviders(<AuthForm />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });
    });
  });

  it('should display error message on login failure', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' })
    });

    renderWithProviders(<AuthForm />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});
```

---

## 🚀 Phase 4: Deployment & Production (Week 4-5)

### 4.1 Docker Setup

#### Backend Dockerfile
```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start application
CMD ["npm", "start"]
```

#### Frontend Dockerfile
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    container_name: authservice-mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
    ports:
      - "27017:27017"
    networks:
      - authservice-network

  backend:
    build: ./backend
    container_name: authservice-backend
    restart: unless-stopped
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://admin:password@mongodb:27017/authservice?authSource=admin
      JWT_SECRET: ${JWT_SECRET}
      SMTP_HOST: ${SMTP_HOST}
      SMTP_PORT: ${SMTP_PORT}
      SMTP_USER: ${SMTP_USER}
      SMTP_PASS: ${SMTP_PASS}
      FROM_EMAIL: ${FROM_EMAIL}
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    networks:
      - authservice-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build: ./frontend
    container_name: authservice-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - authservice-network

  nginx:
    image: nginx:alpine
    container_name: authservice-nginx
    restart: unless-stopped
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    networks:
      - authservice-network

volumes:
  mongodb_data:

networks:
  authservice-network:
    driver: bridge
```

### 4.2 CI/CD Pipeline

#### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:6
        ports:
          - 27017:27017
        options: >-
          --health-cmd "mongosh --eval 'db.runCommand(\"ping\").ok'"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: |
        cd backend && npm ci
        cd ../frontend && npm ci
    
    - name: Run backend tests
      run: |
        cd backend
        npm test
      env:
        MONGODB_URI: mongodb://localhost:27017/test
        JWT_SECRET: test-secret
    
    - name: Run frontend tests
      run: |
        cd frontend
        npm test
    
    - name: Build frontend
      run: |
        cd frontend
        npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /opt/authservice
          git pull origin main
          docker-compose down
          docker-compose build --no-cache
          docker-compose up -d
          docker system prune -f
```

### 4.3 Environment Configuration

#### Production Environment Variables
```bash
# .env.production
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb://admin:password@localhost:27017/authservice?authSource=admin

# JWT
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key-here

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@authservice.com

# Frontend
FRONTEND_URL=https://yourdomain.com
API_URL=https://api.yourdomain.com

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=https://yourdomain.com

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

---

## 🎯 Phase 5: Optional Enhancements

### 5.1 Analytics & Monitoring

#### User Activity Tracking
```javascript
// backend/models/activity.model.js
const ActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  action: {
    type: String,
    required: true,
    enum: ['login', 'logout', 'register', 'password_change', 'profile_update']
  },
  ipAddress: String,
  userAgent: String,
  metadata: mongoose.Schema.Types.Mixed,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// backend/middlewares/activityLogger.js
export const logActivity = (action) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      if (res.statusCode < 400) {
        Activity.create({
          userId: req.user?._id,
          projectId: req.project?._id,
          action,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          metadata: {
            endpoint: req.originalUrl,
            method: req.method
          }
        }).catch(console.error);
      }
      
      originalSend.call(this, data);
    };
    
    next();
  };
};
```

### 5.2 API Explorer Interface

#### Interactive API Documentation
```jsx
// frontend/src/pages/ApiExplorer.jsx
import { useState } from 'react';
import { Play, Copy, Check } from 'lucide-react';

export const ApiExplorer = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [requestData, setRequestData] = useState({});
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const endpoints = [
    {
      method: 'POST',
      path: '/api/auth/register',
      description: 'Register a new user',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'email', type: 'string', required: true },
        { name: 'password', type: 'string', required: true }
      ]
    },
    // ... more endpoints
  ];

  const executeRequest = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000${selectedEndpoint.path}`, {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
          ...(requestData.headers || {})
        },
        body: selectedEndpoint.method !== 'GET' ? JSON.stringify(requestData.body) : undefined
      });

      const data = await response.json();
      setResponse({
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        data
      });
    } catch (error) {
      setResponse({
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">API Explorer</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Endpoint List */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Endpoints</h2>
              <div className="space-y-2">
                {endpoints.map((endpoint, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedEndpoint(endpoint)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedEndpoint === endpoint
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted/60'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-mono ${
                        endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                        endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {endpoint.method}
                      </span>
                      <span className="text-sm font-mono">{endpoint.path}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{endpoint.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Request/Response Panel */}
          <div className="lg:col-span-2">
            {selectedEndpoint ? (
              <div className="space-y-6">
                {/* Request */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Request</h3>
                  
                  {/* Parameters */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-foreground">Parameters</h4>
                    {selectedEndpoint.parameters.map((param, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <label className="text-sm font-medium text-foreground w-24">
                          {param.name}
                        </label>
                        <input
                          type="text"
                          placeholder={param.type}
                          className="input-field flex-1"
                          onChange={(e) => setRequestData(prev => ({
                            ...prev,
                            body: { ...prev.body, [param.name]: e.target.value }
                          }))}
                        />
                        {param.required && (
                          <span className="text-xs text-destructive">*</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={executeRequest}
                    disabled={loading}
                    className="btn-primary mt-4 flex items-center space-x-2"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    <span>Execute Request</span>
                  </button>
                </div>

                {/* Response */}
                {response && (
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Response</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium text-foreground">Status: </span>
                        <span className={`text-sm font-mono ${
                          response.status < 400 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {response.status}
                        </span>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">Response Body</h4>
                        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                          <code>{JSON.stringify(response.data || response.error, null, 2)}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="card p-12 text-center text-muted-foreground">
                Select an endpoint to explore the API
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

## 📝 Development Best Practices

### 1. Code Organization
- Follow consistent naming conventions
- Use TypeScript for better type safety (optional)
- Implement proper error handling
- Add comprehensive logging
- Use environment variables for configuration

### 2. Security Best Practices
- Validate all inputs
- Sanitize user data
- Use HTTPS in production
- Implement proper CORS policies
- Rate limit sensitive endpoints
- Use secure session management
- Regular security audits

### 3. Testing Strategy
- Unit tests for business logic
- Integration tests for API endpoints
- E2E tests for critical user flows
- Test coverage targets (80%+)
- Automated testing in CI/CD

### 4. Performance Optimization
- Database indexing
- Caching strategies
- CDN for static assets
- Image optimization
- Code splitting
- Lazy loading

### 5. Monitoring & Observability
- Application logging
- Error tracking (Sentry)
- Performance monitoring
- Health checks
- Metrics collection

---

## 🎯 Success Metrics

### Technical Metrics
- [ ] 99.9% uptime
- [ ] < 200ms API response time
- [ ] 80%+ test coverage
- [ ] Zero critical security vulnerabilities
- [ ] < 1s page load time

### User Experience Metrics
- [ ] < 3 clicks to complete registration
- [ ] < 5 seconds to login
- [ ] 95%+ form completion rate
- [ ] < 2% error rate
- [ ] Mobile responsiveness score > 95

---

## 📞 Support & Maintenance

### Documentation
- API reference documentation
- Deployment guides
- Troubleshooting guides
- User manuals
- Developer onboarding

### Monitoring
- Real-time error tracking
- Performance monitoring
- User analytics
- Security monitoring
- Backup verification

### Updates
- Regular security updates
- Feature releases
- Bug fixes
- Performance improvements
- Dependency updates

---

**Remember**: Always update `project.md` when completing tasks, adding new requirements, or making architectural decisions. This file serves as the single source of truth for project status and progress tracking. 