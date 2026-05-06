# Phase 3 Task Management Summary

## What was completed
- Created `Task` mongoose model with `title`, `description`, `status` (Enum), `dueDate`, `project` reference, and `assignedTo` reference.
- Implemented `taskController` to manage task operations.
  - Admins can create, read, update, and delete all tasks.
  - Members can view tasks they are assigned to and update ONLY the task's `status`.
  - Added validations to ensure tasks are assigned only to existing project members.
- Defined `taskRoutes` and mounted them at `/api/tasks`.
- Added nested route `GET /api/projects/:projectId/tasks` to fetch tasks scoped to a specific project.
- Created `taskService.js` to wrap Axios API calls for tasks in the frontend.
- Built reusable React components:
  - `TaskCard`: displays task details. Handles inline status updates for assigned members or Admins, and shows edit/delete options for Admins. Shows overdue dates in red.
  - `TaskModal`: a form for Admins to create or edit tasks. Includes a dropdown populated with the project's current members.
- Integrated tasks into `ProjectDetails.jsx`:
  - Fetches and displays tasks related to the active project.
  - Renders a responsive grid of `TaskCard`s.
  - Adds a "New Task" button for Admins.

## Artifacts created
- `backend/models/Task.js`
- `backend/controllers/taskController.js`, `backend/routes/taskRoutes.js`
- `frontend/src/services/taskService.js`
- `frontend/src/components/TaskCard.jsx`, `frontend/src/components/TaskModal.jsx`
