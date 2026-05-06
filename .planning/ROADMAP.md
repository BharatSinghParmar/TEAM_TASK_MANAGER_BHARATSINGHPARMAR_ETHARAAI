# Proposed Roadmap

**5 phases** | **20 requirements mapped** | All v1 requirements covered ✓

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Foundation & Authentication | Set up MERN stack and JWT auth | AUTH-01, AUTH-02, AUTH-03, AUTH-04, ARCH-01, ARCH-02, ARCH-03 | 3 |
| 2 | Project Management | Implement projects & member assignment | PROJ-01, PROJ-02, PROJ-03, PROJ-04 | 3 |
| 3 | Task Management | Build task tracking and assignment | TASK-01, TASK-02, TASK-03, TASK-04 | 3 |
| 4 | Dashboard & Integration | Build analytics and finalize UI | DASH-01, DASH-02 | 3 |
| 5 | Deployment & Polish | Deploy to Railway and finalize | ARCH-04, ARCH-05 | 3 |

### Phase Details

**Phase 1: Foundation & Authentication**
Goal: Set up the MERN stack, database connection, and complete JWT-based authentication system.
Requirements: AUTH-01, AUTH-02, AUTH-03, AUTH-04, ARCH-01, ARCH-02, ARCH-03
Success criteria:
1. User can successfully sign up and their password is hashed in MongoDB.
2. User can log in and receive a valid JWT.
3. Protected routes correctly verify the JWT and enforce role-based access.

**Phase 2: Project Management**
Goal: Implement project creation, management, and member assignment.
Requirements: PROJ-01, PROJ-02, PROJ-03, PROJ-04
Success criteria:
1. Admin can create projects and add members to them.
2. Members can only view projects they are assigned to.
3. Database relationships between User and Project are correctly maintained.

**Phase 3: Task Management**
Goal: Build task creation, assignment, and status tracking within projects.
Requirements: TASK-01, TASK-02, TASK-03, TASK-04
Success criteria:
1. Admin can create tasks assigned to specific project members.
2. Members can update the status of their assigned tasks.
3. Members cannot edit or delete tasks they don't own.

**Phase 4: Dashboard & Integration**
Goal: Build dashboard analytics and finalize full-stack integration and styling.
Requirements: DASH-01, DASH-02
Success criteria:
1. Dashboard correctly aggregates task statistics (total, completed, pending, overdue).
2. Frontend successfully communicates with all backend endpoints.
3. UI is responsive, clean, and styled with Tailwind CSS.

**Phase 5: Deployment & Polish**
Goal: Deploy the application and ensure it is fully functional live.
Requirements: ARCH-04, ARCH-05
Success criteria:
1. Backend is deployed and accessible via Railway.
2. Frontend is deployed and successfully connects to the live backend.
3. GitHub repository contains all code and a complete README.md.
