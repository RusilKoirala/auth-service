<h1 align="center">Auth0-Clone: Self-Hosted Authentication Service</h1>


<p align="center">
  <img src="frontend/public/favicon.svg" alt="Logo" width="64" height="64" />
</p>

<p align="center">
  <b>Modern, open-source authentication for developers.</b><br/>
  Project-scoped user management, email verification, admin dashboard, analytics, and more.<br/>
  <i>Built with Node.js/Express & React/Vite</i>
</p>

<p align="center">
  <img src="frontend/public/screenshot.png" alt="Screenshot" width="700" />
</p>

<p align="center">
  <a href="#features"><img src="https://img.shields.io/badge/Features-Project%20Scoped%20Auth-blue" /></a>
  <a href="#quick-start"><img src="https://img.shields.io/badge/Quick%20Start-Easy%20Setup-brightgreen" /></a>
  <a href="#license"><img src="https://img.shields.io/badge/License-MIT-yellow" /></a>
  <img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-brightgreen" />
  <img src="https://img.shields.io/badge/Frontend-React%20%7C%20Vite-blue" />
  <img src="https://img.shields.io/badge/Database-MongoDB-green" />
</p>

---

##  Features

- 🏢 **Project-Scoped User Management**: Each project has its own isolated user base, API key, and analytics.
- 📧 **Email Verification**: Secure signups with built-in email verification (MailerSend or SMTP).
- 🛡️ **Admin Dashboard & Analytics**: Manage users, resend verification, and view project stats.
- 🎨 **Modern UI/UX**: Beautiful, responsive, and dark-mode ready for devs and users.
- 🌐 **Hybrid CORS**: Public/protected API endpoints for SaaS or embedded use.
- 🐳 **Production-Ready Dockerfile**: Easy deployment to Railway, Render, or your own server.

---

##  Architecture

```mermaid
flowchart LR
  subgraph Frontend [React/Vite]
    F1[Login/Register]
    F2[Dashboard]
    F3[Docs]
  end
  subgraph Backend [Node.js/Express]
    B1[Auth API]
    B2[Project API]
    B3[Admin API]
    B4[MailerSend/SMTP]
    B5[MongoDB]
  end
  F1-->|API|B1
  F2-->|API|B2
  F3-->|API|B3
  B1-->|DB|B5
  B2-->|DB|B5
  B3-->|DB|B5
  B1-->|Email|B4
```

---

##  Environment Variables

**Where to put your `.env` files:**

- **Backend:** Place `.env` in `/backend`.
  - Example:
    ```env
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    FRONTEND_URL=https://your-frontend.com
    MAILERSEND_API_KEY=your_mailersend_api_key
    FROM_EMAIL=your_verified_sender@yourdomain.com
    ```
- **Frontend:** Place `.env` in `/frontend`.
  - Example:
    ```env
    VITE_API_BASE_URL=https://your-backend.com/api
    ```
- **Never commit your `.env` files to GitHub!**

---

##  Quick Start

```sh
# Backend
cd backend
cp .env.example .env  # Fill in your secrets
npm install
npm start

# Frontend
cd ../frontend
cp .env.example .env   # Set VITE_API_BASE_URL
npm install
npm run dev
```

---

##  Production
- See the Dockerfile in `/backend` for deployment.
- Set all secrets in Railway/your host.
- Frontend: build with `npm run build` and deploy `dist/` to Vercel/Netlify/etc.

---

##  Contributors
<p>
  <a href="https://github.com/rusilkoirala"><img src="https://avatars.githubusercontent.com/u/10229899?v=4" width="48" height="48" style="border-radius:50%" alt="Rusil Koirala" /></a>
  <!-- Add more contributors here -->
</p>

---

##  Contributing

We welcome contributions! To get started:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to your branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

##  Documentation
- [Features & API Reference](#features)
- [Docs UI](https://github.com/rusilkoirala/auth-service)

---

##  License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
