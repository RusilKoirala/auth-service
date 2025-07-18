# 🛠 Project: Scoped API Auth Service

> **NOTE:** The current frontend UI and style are approved and must NOT be changed. Do not alter the UI or styling in future updates. Only backend/API logic or bug fixes are allowed unless otherwise specified.

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

- Backend: Node.js, Express.js, MongoDB (Mongoose)
- Frontend: React (Vite), Tailwind CSS
- Auth: bcrypt + JWT
- Optional Features: Refresh token, email verification (coming later)

---

## ⚙️ Backend Features

### 🔐 Project Auth Middleware
- Middleware extracts project from `x-api-key` or similar
- Used to scope routes under a project

### 👥 Project User Routes
- `POST /project-users/register`: Register a user under a project
- `POST /project-users/login`: Login a user (returns JWT)
- `GET /project-users/me`: Returns current project user (auth required)

---

## 🖥 Frontend Pages to Build

1. `/`: Homepage
   - Hero section, light/dark mode toggle
   - Explain what the service does
   - Login CTA

2. `/login`: Project-scoped login UI
   - Email + password
   - Stores JWT locally
   - Dark/light responsive

3. `/dashboard`: Project-user dashboard
   - Fetch `/me` route using stored token
   - Show user info, logout button

4. `/docs`: Documentation
   - Auto-generated or manually written docs based on backend
   - Describes how to register project, use APIs, etc.
   - Markdown-style, minimal Vercel-style layout

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

## 🧠 AI Usage Rules

> If you're an AI like Cursor, **read this file first** and always follow it. Never generate pages or routes not listed here.

- Never create extra features unless this file says so.
- Always refer back to this document.
- Treat it like the source of truth (ignore backend code unless you're confirming something).
- Follow folder structure and page layout as outlined above.

---

## 📁 File Structure (Frontend)

```txt
src/
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   └── Docs.jsx
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ThemeToggle.jsx
│   └── AuthForm.jsx
├── context/
│   └── AuthContext.jsx
├── utils/
│   └── api.js
├── styles/
│   └── tailwind.config.js
└── App.jsx

---

