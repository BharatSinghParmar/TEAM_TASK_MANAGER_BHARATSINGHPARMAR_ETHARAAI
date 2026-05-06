# Phase 2: Project Management - Plan

## Goal
Implement project creation, management, and member assignment.

## Tasks

1. **Database Models**:
   - Create `Project` Mongoose schema with fields: `name` (String), `description` (String), `createdBy` (ObjectId ref User), `members` (Array of ObjectId ref User).

2. **Project Controllers & Routes (Backend)**:
   - Implement `createProject` controller (Admin only, sets `createdBy` to req.user._id).
   - Implement `getProjects` controller (Admins see all projects, Members only see projects where their `_id` is in `members`).
   - Implement `getProjectById` controller (Ensure proper access control).
   - Implement `updateProject` and `deleteProject` (Admin only).
   - Implement `addMemberToProject` and `removeMemberFromProject` (Admin only).
   - Create `projectRoutes.js` and mount it in `server.js` (`/api/projects`). Use `protect` and `admin` middleware from Phase 1.

3. **User Controller (Backend)**:
   - Create `getAllUsers` endpoint for Admins so they can assign members to projects.

4. **Frontend Services**:
   - Create `src/services/projectService.js` to handle API requests for projects.
   - Create `src/services/userService.js` to handle fetching users for assignment.

5. **Frontend Components & Pages**:
   - Create `Projects` page to list projects (Admins see 'Create Project' button).
   - Create `ProjectDetails` page to view a single project.
   - Create `ProjectModal` for creating/editing projects (Admin only).
   - Create `ManageMembersModal` on the ProjectDetails page for Admins to add/remove users from the project.

## Files
- `backend/models/Project.js`
- `backend/controllers/projectController.js`
- `backend/controllers/userController.js`
- `backend/routes/projectRoutes.js`
- `backend/routes/userRoutes.js`
- `backend/server.js` (update)
- `frontend/src/services/projectService.js`
- `frontend/src/services/userService.js`
- `frontend/src/pages/Projects.jsx`
- `frontend/src/pages/ProjectDetails.jsx`
- `frontend/src/components/ProjectModal.jsx`
- `frontend/src/components/ManageMembersModal.jsx`
- `frontend/src/App.jsx` (update routes)
