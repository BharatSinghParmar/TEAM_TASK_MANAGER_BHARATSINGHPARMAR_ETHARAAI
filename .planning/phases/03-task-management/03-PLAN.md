# Phase 3: Task Management - Plan

## Goal
Build task creation, assignment, and status tracking within projects.

## Tasks

1. **Database Models**:
   - Create `Task` Mongoose schema with fields: `title` (String), `description` (String), `status` (Enum: 'Pending', 'In Progress', 'Completed', default: 'Pending'), `dueDate` (Date), `project` (ObjectId ref Project), `assignedTo` (ObjectId ref User).

2. **Task Controllers & Routes (Backend)**:
   - Implement `createTask` (Admin only, requires `project` and `assignedTo`).
   - Implement `getTasksByProject` (Returns tasks for a specific project. Members only see tasks assigned to them, Admins see all).
   - Implement `getTasks` (Returns all tasks for the user. Members get assigned tasks, Admins get all tasks across all projects).
   - Implement `updateTask` (Members can only update `status` of their assigned tasks. Admins can update all fields).
   - Implement `deleteTask` (Admin only).
   - Create `taskRoutes.js` and mount it in `server.js` (`/api/tasks`). Also add nested route in `projectRoutes.js` for `/api/projects/:projectId/tasks`.

3. **Frontend Services**:
   - Create `src/services/taskService.js` to handle API requests for tasks.

4. **Frontend Components & Pages**:
   - Update `ProjectDetails.jsx` to fetch and display tasks for the project.
   - Add "Create Task" button in `ProjectDetails.jsx` (Admin only).
   - Create `TaskModal.jsx` for creating/editing tasks. Admins can edit all fields.
   - Create `TaskCard.jsx` to display individual tasks.
   - Members should see a dropdown/buttons on their `TaskCard` to easily change status (e.g., move from 'Pending' to 'In Progress').

## Files
- `backend/models/Task.js`
- `backend/controllers/taskController.js`
- `backend/routes/taskRoutes.js`
- `backend/routes/projectRoutes.js` (update)
- `backend/server.js` (update)
- `frontend/src/services/taskService.js`
- `frontend/src/pages/ProjectDetails.jsx` (update)
- `frontend/src/components/TaskModal.jsx`
- `frontend/src/components/TaskCard.jsx`
