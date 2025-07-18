# 🔐 AuthService - Self-Hosted Authentication Platform

> A production-ready, self-hosted authentication service that gives developers complete control over their authentication infrastructure. Think Auth0 or Clerk, but self-hosted and fully customizable.

![AuthService Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-brightgreen)
![React](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%7C%20Mongoose-green)

## ✨ Features

- **🔐 Project-Scoped Authentication** - Each project has its own isolated user base
- **🔑 API Key Management** - Secure API key generation and rotation
- **🛡️ JWT Security** - Industry-standard token-based authentication
- **👥 User Management** - Complete CRUD operations for project users
- **📊 Admin Dashboard** - Project owners can manage their users
- **🎨 Modern UI/UX** - Beautiful, responsive design with dark/light mode
- **📱 Embeddable Components** - Ready-to-use login components
- **📚 Comprehensive Documentation** - API docs with code examples
- **⚡ High Performance** - Optimized for production use

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB 6+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/auth0-clone.git
cd auth0-clone
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🏗️ Architecture

### Backend (Node.js/Express)
- **Authentication**: JWT-based auth with bcrypt password hashing
- **Database**: MongoDB with Mongoose ODM
- **Security**: Rate limiting, CORS, input validation
- **API**: RESTful endpoints with proper error handling

### Frontend (React 19)
- **Framework**: React with Vite for fast development
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router for SPA navigation
- **State Management**: React Context for auth state
- **UI Components**: Custom components with Lucide React icons

## 📁 Project Structure

```
auth0-clone/
├── backend/                 # Node.js API server
│   ├── controllers/        # Request handlers
│   ├── middlewares/        # Auth & validation middleware
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API route definitions
│   └── utils/             # Helper functions
├── frontend/              # React application
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── context/          # React context providers
│   └── utils/            # API utilities
└── test/                 # Test application with embedded component
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Projects
- `POST /api/projects/create` - Create new project
- `GET /api/projects/` - List user projects

### Project Users
- `POST /api/project-users/register` - Register project user
- `POST /api/project-users/login` - Project user login
- `GET /api/project-users/me` - Get current project user

### Admin
- `GET /api/admin/users` - List project users
- `PUT /api/admin/users/:id` - Update user role
- `DELETE /api/admin/users/:id` - Delete user

## 🎨 Design System

The UI was designed with modern principles and enhanced with AI assistance for optimal user experience:

- **Typography**: Geist, Satoshi, and Inter fonts
- **Color Scheme**: Adaptive light/dark themes
- **Components**: Consistent design language
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first approach

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **API Key Validation**: Project-scoped API access
- **Rate Limiting**: Protection against abuse
- **CORS**: Configurable cross-origin policies
- **Input Validation**: Comprehensive request validation

## 🚀 Deployment

### Environment Variables

```env
# Backend (.env)
MONGODB_URI=mongodb://localhost:27017/authservice
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=production

# Frontend (.env)
VITE_API_URL=http://localhost:5000/api
```

### Production Build

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
# Deploy dist/ folder to your hosting service
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **UI/UX Enhancement**: AI assistance was used to refine the user interface and improve the overall user experience
- **Icons**: [Lucide React](https://lucide.dev/) for beautiful icons
- **Design Inspiration**: Vercel, Cursor, and Astro for modern design patterns

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.

---

**Built with ❤️ for developers who want control over their authentication infrastructure**
