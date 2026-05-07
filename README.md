# Team Task Manager

A production-ready, full-stack web application for managing projects, tasks, and team collaboration with **role-based access control (RBAC)**. Built with the MERN stack and deployed on Railway.

---

## Live Demo

> **Deployed URL:** *teamtaskmanagerbharatsinghparmaretharaai-production-b3ad.up.railway.app*

---

## Assignment Requirements — Completion Checklist

| Requirement | Status |
|---|---|
| Authentication (Signup / Login) | ✅ Complete |
| Project & Team Management | ✅ Complete |
| Task Creation, Assignment & Status Tracking | ✅ Complete |
| Dashboard with analytics & overdue tasks | ✅ Complete |
| REST APIs + MongoDB (NoSQL) | ✅ Complete |
| Proper validations & model relationships | ✅ Complete |
| Role-Based Access Control (Admin / Member) | ✅ Complete |
| Deployment on Railway | ✅ Ready |
| README | ✅ Complete |

---

## Key Features

### 🔐 Authentication
- Secure Signup & Login with **Direct Role Enforcement**
- JWT-based session management (30-day expiry)
- bcrypt password hashing
- Protected routes on both frontend and backend

### Role-Based Access Control (RBAC)
| Capability | Admin | Member |
|---|---|---|
| Create / Delete Projects | ✅ | ❌ |
| Add / Remove Members | ✅ | ❌ |
| Create / Edit / Delete Tasks | ✅ | ❌ |
| Update status of assigned tasks | ✅ | ✅ |
| Post comments & attachments | ✅ | ✅ |
| View Dashboard analytics | ✅ | ✅ |

### Project & Task Management
- Create and manage projects with team members
- Assign tasks to specific team members
- Task status tracking: **Pending → In Progress → Completed**
- Overdue detection with visual indicators

### Collaboration
- Comment system with file attachments (images, PDFs up to 5MB)
- Activity log / audit trail on every task (status changes, reassignments)
- Relative timestamps using `date-fns`

### Dashboard Analytics
- Total projects, tasks by status, overdue count
- Recent tasks overview
- Role-specific dynamic greetings

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router v7, Tailwind CSS v4 |
| Backend | Node.js, Express.js 5 |
| Database | MongoDB Atlas (Mongoose ODM) |
| Authentication | JWT, bcryptjs |
| File Uploads | Multer |
| Deployment | Railway |

---

## Folder Structure

```
team-task-manager/
├── backend/
│   ├── config/         # DB connection
│   ├── controllers/    # Business logic
│   ├── middleware/     # Auth, RBAC, Upload
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   └── server.js       # Entry point (also serves frontend)
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # AuthContext (global state)
│   │   ├── pages/      # Route-level screens
│   │   └── services/   # Axios API wrappers
│   └── vite.config.js
└── package.json        # Root scripts
```

---

## Demo Credentials

> Direct login with role verification enabled.

### Admin
- **Email:** `admin@taskmanager.com`
- **Password:** `admin123`
- Full project, task, and member management access.

### Member
- **Email:** `rahul@taskmanager.com`
- **Password:** `member123`
- Can only view assigned projects and update statuses of assigned tasks.

- **Email:** `priya@taskmanager.com`
- **Password:** `member123`

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas URI (or local MongoDB)

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd team-task-manager
```

### 2. Configure environment
Create `backend/.env`:
```env
PORT=8000
NODE_ENV=development
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
```

### 3. Install & run
```bash
npm run install-all   # Installs root + backend + frontend deps
npm run build         # Builds React frontend into backend/dist
npm run start:prod    # Starts Express server on port 8000
```

Visit `http://localhost:8000`

---

## Railway Deployment

1. Push this repo to GitHub.
2. Create a new Railway project and connect the GitHub repo.
3. Add the following environment variables in Railway:

| Variable | Value |
|---|---|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A secure random string |
| `NODE_ENV` | `production` |

4. Railway auto-detects `npm start` from the root `package.json`. The Express server serves the pre-built React frontend as static files.

---

## API Overview

| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/signup` | Public |
| POST | `/api/auth/login` | Public |
| GET / POST | `/api/projects` | Protected |
| GET / PUT / DELETE | `/api/projects/:id` | Protected |
| GET / POST | `/api/tasks` | Protected |
| GET / PUT / DELETE | `/api/tasks/:id` | Protected |
| POST | `/api/tasks/:id/comments` | Protected |
| GET | `/api/dashboard/metrics` | Protected |

All protected routes require `Authorization: Bearer <token>` header.

---

## Security

- Passwords hashed with **bcryptjs** (salt rounds: 10)
- JWT tokens expire after **30 days**
- File uploads validated by MIME type (images & PDFs only, max 5MB)
- Admin-only routes protected by `adminOnly` middleware on the backend
- Member UI fields are disabled client-side and enforced server-side
