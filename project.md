# 🛠 Project: Scoped API Auth Service

> **NOTE:** The current frontend UI and style are approved and must NOT be changed. Do not alter the UI or styling in future updates. Only backend/API logic or bug fixes are allowed unless otherwise specified.

## 📊 PROJECT STATUS: 90% COMPLETE

### ✅ COMPLETED FEATURES (100% Done)
- [x] **Backend Core**: Node.js/Express API with MongoDB
- [x] **Authentication System**: JWT + bcrypt, user registration/login
- [x] **Project Management**: Create projects, API key generation
- [x] **Project-Scoped Users**: Isolated user bases per project
- [x] **Admin Dashboard**: User management, role management
- [x] **Frontend Core**: React 19 + Vite + Tailwind CSS
- [x] **All Pages**: Home, Login, Dashboard, Projects, Project Details, Docs
- [x] **UI/UX**: Modern design with dark/light mode
- [x] **Embeddable Component**: AuthServiceLogin for third-party integration
- [x] **API Documentation**: Comprehensive docs with code examples
- [x] **Security Middleware**: JWT validation, project auth, rate limiting

### ✅ PHASE 1 COMPLETED: UI Polish & UX Improvements
- [x] **Responsive Design Fixes**
  - [x] Mobile navigation improvements with better touch targets
  - [x] Form validation feedback with real-time validation
  - [x] Loading state animations with multiple variants
  - [x] Error message styling with icons and better contrast
- [x] **Accessibility Improvements**
  - [x] ARIA labels and roles for screen readers
  - [x] Keyboard navigation with focus management
  - [x] Screen reader support with proper semantic markup
  - [x] Color contrast compliance and high contrast mode support

### 🚧 IN PROGRESS
- [ ] **Security Enhancements**: Email verification, refresh tokens, 2FA

### 📋 REMAINING TASKS (10% Left)

#### 🔒 Phase 2: Security Enhancements
- [ ] **Email Verification System**
  - [ ] Email templates
  - [ ] Verification token generation
  - [ ] Email sending service (Nodemailer)
  - [ ] Verification status tracking
- [ ] **Refresh Token Implementation**
  - [ ] Token rotation strategy
  - [ ] Refresh token storage
  - [ ] Automatic token renewal
  - [ ] Token blacklisting
- [ ] **Two-Factor Authentication (2FA)**
  - [ ] TOTP implementation (speakeasy)
  - [ ] QR code generation
  - [ ] Backup codes system
  - [ ] 2FA setup flow
- [ ] **Enhanced Rate Limiting**
  - [ ] Per-endpoint limits
  - [ ] IP-based blocking
  - [ ] Account lockout protection

#### 🧪 Phase 3: Testing Implementation
- [ ] **Backend Testing**
  - [ ] Unit tests (Jest)
  - [ ] Integration tests
  - [ ] API endpoint testing
  - [ ] Authentication flow tests
- [ ] **Frontend Testing**
  - [ ] Component tests (React Testing Library)
  - [ ] User interaction tests
  - [ ] Form validation tests
  - [ ] API integration tests
- [ ] **E2E Testing (Optional)**
  - [ ] Playwright/Cypress setup
  - [ ] Critical user journey tests
  - [ ] Cross-browser testing

#### 🚀 Phase 4: Deployment & Production
- [ ] **Docker Setup**
  - [ ] Backend Dockerfile
  - [ ] Frontend Dockerfile
  - [ ] Docker Compose for development
  - [ ] Production Docker setup
- [ ] **Environment Configuration**
  - [ ] Production environment variables
  - [ ] Database connection pooling
  - [ ] Logging configuration
  - [ ] Error monitoring setup
- [ ] **CI/CD Pipeline**
  - [ ] GitHub Actions workflow
  - [ ] Automated testing
  - [ ] Build and deployment
  - [ ] Environment promotion
- [ ] **Documentation**
  - [ ] Deployment guide
  - [ ] Production checklist
  - [ ] Troubleshooting guide
  - [ ] API reference updates

#### 🎯 Phase 5: Optional Enhancements
- [ ] **Analytics & Monitoring**
  - [ ] User activity tracking
  - [ ] API usage analytics
  - [ ] Error monitoring (Sentry)
  - [ ] Performance monitoring
- [ ] **Developer Experience**
  - [ ] API explorer interface
  - [ ] SDK generation
  - [ ] Webhook system
  - [ ] Developer onboarding flow

---

## 🧩 Description

A backend-as-a-service that allows developers to:
- Register their project
- Offer login/signup UI for their users
- Track user activity per project
- Authenticate project users using JWT
- Manage users per project securely

> Think of this like Clerk/Auth0, but self-hosted and scoped per project.

---

## 🧪 Tech Stack

- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Frontend**: React 19, Vite, Tailwind CSS
- **Auth**: bcrypt + JWT
- **Testing**: Jest, React Testing Library
- **Deployment**: Docker, GitHub Actions
- **Monitoring**: Sentry (optional)

---

## ⚙️ Backend Features

### 🔐 Project Auth Middleware
- Middleware extracts project from `x-api-key` or similar
- Used to scope routes under a project

### 👥 Project User Routes
- `POST /project-users/register`: Register a user under a project
- `POST /project-users/login`: Login a user (returns JWT)
- `GET /project-users/me`: Returns current project user (auth required)

### 🔒 Security Features (Planned)
- Email verification system
- Refresh token rotation
- Two-factor authentication (TOTP)
- Enhanced rate limiting
- Account lockout protection

---

## 🖥 Frontend Pages

1. `/`: Homepage ✅
   - Hero section, light/dark mode toggle
   - Explain what the service does
   - Login CTA

2. `/login`: Project-scoped login UI ✅
   - Email + password
   - Stores JWT locally
   - Dark/light responsive

3. `/dashboard`: Project-user dashboard ✅
   - Fetch `/me` route using stored token
   - Show user info, logout button

4. `/docs`: Documentation ✅
   - Auto-generated or manually written docs based on backend
   - Describes how to register project, use APIs, etc.
   - Markdown-style, minimal Vercel-style layout

5. `/projects`: Project management ✅
   - List user projects
   - Create new projects
   - Manage API keys

6. `/projects/:id`: Project details ✅
   - Project information
   - User management
   - Analytics dashboard

---

## 🎨 Design System

- Modern, minimalist UI
- Inspired by:
  - Vercel.com
  - Cursor.sh
  - Astro.build
- Features:
  - Light/dark toggle
  - Animated transitions
  - Beautiful typography
  - Responsive from mobile → desktop

---

## 📁 File Structure

```txt
auth0-clone/
├── backend/                 # Node.js API server
│   ├── controllers/        # Request handlers
│   ├── middlewares/        # Auth & validation middleware
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API route definitions
│   ├── utils/             # Helper functions
│   ├── tests/             # Backend tests
│   └── docker/            # Docker configuration
├── frontend/              # React application
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── context/          # React context providers
│   ├── utils/            # API utilities
│   ├── tests/            # Frontend tests
│   └── public/           # Static assets
├── test/                 # Test application with embedded component
├── docs/                 # Documentation
├── docker-compose.yml    # Development environment
└── .github/              # CI/CD workflows
```

---

## 🧠 AI Usage Rules

> If you're an AI like Cursor, **read this file first** and always follow it. Never generate pages or routes not listed here.

- Never create extra features unless this file says so.
- Always refer back to this document.
- Treat it like the source of truth (ignore backend code unless you're confirming something).
- Follow folder structure and page layout as outlined above.
- **ALWAYS UPDATE THIS FILE** when completing tasks or adding new requirements.

---

## 📝 Development Notes

### Recent Decisions
- **2024-01-XX**: Project structure finalized
- **2024-01-XX**: UI design approved, no further changes allowed
- **2024-01-XX**: Security enhancements prioritized for Phase 2
- **2024-01-XX**: Phase 1 UI improvements completed successfully

### Phase 1 Implementation Details

#### ✅ Responsive Design Improvements
- **Mobile Navigation**: Enhanced mobile menu with better touch targets, focus management, and keyboard navigation
- **Form Validation**: Real-time validation with visual feedback, error states, and success indicators
- **Loading States**: Multiple loading variants (spinner, dots, pulse) with skeleton components
- **Error Handling**: Improved error messages with icons and better visual hierarchy

#### ✅ Accessibility Enhancements
- **ARIA Labels**: Comprehensive ARIA labels and roles for all interactive elements
- **Keyboard Navigation**: Full keyboard support with focus management and escape key handling
- **Screen Reader Support**: Proper semantic markup and screen reader announcements
- **Color Contrast**: WCAG AA compliant color contrast with high contrast mode support
- **Reduced Motion**: Respects user's motion preferences

#### ✅ UI/UX Polish
- **Form Feedback**: Real-time validation with success/error states
- **Loading Animations**: Smooth loading states for all async operations
- **Mobile Optimization**: Better responsive design for all screen sizes
- **Focus Management**: Proper focus handling for modals and navigation
- **Error States**: Clear error messaging with actionable feedback

### Blockers & Issues
- None currently identified

### Next Milestone
- Complete Phase 2 (Security Enhancements) by [DATE]
- Target: 95% completion

---

## 🔄 Progress Tracking

### Week 1 Goals ✅ COMPLETED
- [x] Complete responsive design fixes
- [x] Implement error state improvements
- [x] Add loading state animations
- [x] Enhance accessibility features

### Week 2 Goals
- [ ] Implement email verification system
- [ ] Add refresh token functionality
- [ ] Begin 2FA implementation

### Week 3 Goals
- [ ] Complete 2FA implementation
- [ ] Set up testing framework
- [ ] Write initial test suites

### Week 4 Goals
- [ ] Docker setup and configuration
- [ ] CI/CD pipeline implementation
- [ ] Production deployment preparation

---

**Last Updated**: [DATE]
**Current Phase**: Phase 2 - Security Enhancements
**Overall Progress**: 90% Complete

---

## 🔍 Troubleshooting Notes

- Always include `Authorization` header if the route is protected.
- Validate `projectId` before making requests to avoid 404s.
- On error, check if the backend route exists, and the data exists.
- Use DevTools + Postman to test routes individually.

---

### 🐞 Debugging Log: 404 on /api/projects/:id

- Identified missing GET /api/projects/:id route in backend. Added route and controller (getProjectById) with error handling and logging.
- Controller now returns 400 for invalid IDs, 404 for not found, and logs all requests.
- Frontend ProjectDetails.jsx updated to use .catch() and show a toast/snackbar on fetch error.
- Clean fallback UI for not found or error states.
- Reminder: Always check if the project exists in the DB, and use a valid ID for testing.

---

### 🐞 Debugging Log: 401 Unauthorized on /api/admin/users (JWT Malformed)

- Confirmed backend expects JWT in Authorization header as 'Bearer <token>'
- Added debug logs in frontend (api.js) to print the token being sent
- Added debug logs in backend (auth.middleware.js) to print the token received
- Ensured token is stored in localStorage as 'authToken' after login (AuthContext)
- If token is missing or invalid, user is redirected to login
- If 401 persists, check login flow, token expiry, and user role

---

### 🐞 Debugging Log: Admin User Access to /api/admin/users

**Sample backend log output:**

```
[authMiddleware] Received token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...<snip>
[authMiddleware] Decoded user: { id: '64f...', email: 'admin@example.com', role: 'admin', iat: ..., exp: ... }
[authMiddleware] req.user.role: admin
```

**Current protected route flow:**
1. User logs in, receives JWT, which is stored in localStorage as 'authToken'.
2. Frontend sends requests to protected routes with `Authorization: Bearer <token>` header.
3. Backend `authMiddleware` verifies the token, attaches user to `req.user`, and logs user/role.
4. Admin-only routes check `req.user.role === 'admin'` before allowing access.
5. If token is missing/invalid, or user is not admin, backend returns 401/403 and frontend redirects to login or shows error.

---

### 🐞 Example Debug Output: Successful Admin Request

```
[authMiddleware] Start
[authMiddleware] Received token: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...<snip>
[authMiddleware] Decoded user: { id: '...', email: 'admin@example.com', role: 'admin', ... }
[authMiddleware] req.user.role: admin
[projectAuthMiddleware] Start
[projectAuthMiddleware] req.user: { ... }
[projectAuthMiddleware] req.project: { ... }
[ownerAuthMiddleware] Start
[ownerAuthMiddleware] req.user: { ... }
[ownerAuthMiddleware] req.project: { ... }
[admin.routes] req.user: { ... }
```

### 📝 Why Missing authMiddleware Causes 401

If `authMiddleware` is not applied before `projectAuthMiddleware` and `ownerAuthMiddleware`, then `req.user` is never set. Since both downstream middlewares and admin route handlers rely on `req.user` for permission checks, this results in 401 Unauthorized errors. By adding `authMiddleware` first, the JWT is validated, the user is attached to `req.user`, and the rest of the authorization chain can function as intended.

---

