# Phase 4: Dashboard & Analytics - Plan

## Goal
Aggregate tasks and projects into a global dashboard overview based on user role, and implement global navigation.

## Tasks

1. **Backend API**:
   - Create `dashboardController.js` with `getDashboardMetrics` endpoint.
     - Fetches total projects count (Admin: all, Member: assigned).
     - Fetches total tasks and groups by status (Admin: all, Member: assigned).
   - Create `dashboardRoutes.js` mapped to `/api/dashboard` and mount it in `server.js`.

2. **Frontend Service**:
   - Create `src/services/dashboardService.js` to call the `/api/dashboard` endpoint.

3. **Frontend Components & Pages**:
   - Create `Navbar.jsx` to provide global navigation (links to "Dashboard" and "Projects"). Move the "Logout" functionality here.
   - Update `App.jsx` to include `<Navbar />` inside a persistent layout wrapper for protected routes.
   - Create `Dashboard.jsx` (replacing the inline placeholder in `App.jsx`).
   - Create `DashboardStats.jsx` component to render metric cards (Total Projects, Tasks by Status).
   - Show recent active projects or tasks on the Dashboard page below the stats.

## Files
- `backend/controllers/dashboardController.js`
- `backend/routes/dashboardRoutes.js`
- `backend/server.js` (update)
- `frontend/src/services/dashboardService.js`
- `frontend/src/components/Navbar.jsx`
- `frontend/src/components/DashboardStats.jsx`
- `frontend/src/pages/Dashboard.jsx`
- `frontend/src/App.jsx` (update)
