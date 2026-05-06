# Team Task Manager

## What This Is

Team Task Manager is a full-stack MERN web application where users can create projects, assign tasks, and track progress with role-based access control (Admin/Member). It provides a complete production-ready platform with authentication, dashboard analytics, REST APIs, MongoDB database relationships, and deployment on Railway.

## Core Value

A fully functional, cleanly structured, and deployable backend architecture focused on robust engineering, proper APIs, authentication, and database design.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Complete JWT-based authentication system (Signup, Login, bcryptjs, token generation)
- [ ] User role implementation (Admin, Member) with appropriate middleware
- [ ] Proper MongoDB schemas for User, Project, and Task with relationships
- [ ] Comprehensive Project REST APIs (Admin create/edit/delete, Member view)
- [ ] Comprehensive Task REST APIs (Admin create/assign/delete, Member update status)
- [ ] Dashboard APIs for task statistics (total, completed, pending, overdue)
- [ ] Frontend integration with Vite, React.js, Tailwind CSS, and Axios
- [ ] Basic UI layout (Login/Signup, Dashboard, Projects, Tasks, Navbar, Sidebar)
- [ ] Production deployment on Railway (Backend) and Railway/Vercel (Frontend)
- [ ] Comprehensive README.md and clean GitHub repository structure

### Out of Scope

- Complex UI animations — focus is on functional backend engineering
- Drag and drop functionality — outside scope constraints
- Realtime web sockets — outside scope constraints
- Chat systems — outside scope constraints
- Notifications — outside scope constraints

## Context

- This is a Software Engineer assignment submission that prioritizes backend fundamentals and deployment readiness.
- Must be completed within a 1-2 day timeline.
- Requires a live deployed URL and a public GitHub repository.
- A 2-5 minute demo video demonstrating core functionality is required.

## Constraints

- **Timeline**: 1-2 days — Project must be optimized for fast completion.
- **Tech Stack**: MERN Stack (MongoDB, Express.js, React.js, Node.js) with Tailwind CSS — Required by assignment.
- **Deployment**: Railway is mandatory for backend deployment.
- **Design**: UI must be simple and professional, without overengineering.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Focus on backend quality | Assignment prioritizes APIs, auth, and DB design over UI | — Pending |
| JWT Authentication | Industry standard for MERN stack session management | — Pending |
| Role-Based Access | Requirement to differentiate Admin (full control) and Member (limited to own tasks) | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-06 after initialization*
