# Requirements

## v1 Requirements

### Authentication
- [ ] **AUTH-01**: User can sign up with Name, Email, Password, and Role (Admin/Member)
- [ ] **AUTH-02**: User can log in with Email and Password
- [ ] **AUTH-03**: System uses JWT and bcryptjs for secure session management
- [ ] **AUTH-04**: User can log out

### Projects
- [ ] **PROJ-01**: Admin can create a new project
- [ ] **PROJ-02**: Admin can add/remove members to/from a project
- [ ] **PROJ-03**: Admin can view, update, and delete all projects
- [ ] **PROJ-04**: Member can view assigned projects

### Tasks
- [ ] **TASK-01**: Admin can create tasks within a project and assign them to members
- [ ] **TASK-02**: Admin can view, update, and delete all tasks
- [ ] **TASK-03**: Member can view assigned tasks
- [ ] **TASK-04**: Member can update the status of their assigned tasks

### Dashboard
- [ ] **DASH-01**: Dashboard displays task statistics (total, completed, pending, overdue)
- [ ] **DASH-02**: Dashboard displays assigned tasks for the current user

### Architecture
- [ ] **ARCH-01**: Frontend application built with React, Vite, Tailwind CSS, and Axios
- [ ] **ARCH-02**: Backend REST API built with Node.js and Express.js
- [ ] **ARCH-03**: Database using MongoDB Atlas and Mongoose with relationships
- [ ] **ARCH-04**: Proper backend validations and error handling
- [ ] **ARCH-05**: Deployed to Railway (Backend) and Railway/Vercel (Frontend)

## v2 Requirements
(None - complete assignment scope captured in v1)

## Out of Scope
- Complex animations — focus on core functionality
- Real-time sockets/chat/notifications — beyond assignment scope

## Traceability
- **Phase 1: Foundation & Authentication**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, ARCH-01, ARCH-02, ARCH-03
- **Phase 2: Project Management**: PROJ-01, PROJ-02, PROJ-03, PROJ-04
- **Phase 3: Task Management**: TASK-01, TASK-02, TASK-03, TASK-04
- **Phase 4: Dashboard & Integration**: DASH-01, DASH-02
- **Phase 5: Deployment & Polish**: ARCH-04, ARCH-05
