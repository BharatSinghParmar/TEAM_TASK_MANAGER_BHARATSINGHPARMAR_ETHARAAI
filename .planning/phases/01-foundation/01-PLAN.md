# Phase 1: Foundation & Authentication - Plan

## Goal
Set up the MERN stack, database connection, and complete JWT-based authentication system.

## Tasks

1. **Backend Initialization**:
   - Initialize Node.js project.
   - Install dependencies (express, mongoose, dotenv, cors, bcryptjs, jsonwebtoken).
   - Set up `server.js` with basic Express configuration and CORS.
   - Configure MongoDB connection.

2. **Database Models**:
   - Create `User` Mongoose schema (`name`, `email`, `password`, `role`).

3. **Authentication Controllers & Routes**:
   - Implement `signup` controller (hash password, save user, return JWT).
   - Implement `login` controller (verify password, return JWT).
   - Create `auth` routes (`POST /api/auth/signup`, `POST /api/auth/login`).
   - Implement `authMiddleware` to protect routes using JWT.

4. **Frontend Initialization**:
   - Initialize React Vite project with Tailwind CSS.
   - Install dependencies (axios, react-router-dom, react-hot-toast).
   - Set up folder structure and routing.

5. **Frontend Auth Integration**:
   - Create generic Axios instance for API calls.
   - Implement Login Page and Signup Page.
   - Implement auth context to store user and JWT token.
   - Store JWT in `localStorage` for persistent auth.
   - Implement logout functionality.

## Files
- `backend/server.js`
- `backend/models/User.js`
- `backend/controllers/authController.js`
- `backend/routes/authRoutes.js`
- `backend/middleware/authMiddleware.js`
- `frontend/src/App.jsx`
- `frontend/src/api/axios.js`
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/pages/Login.jsx`
- `frontend/src/pages/Signup.jsx`
