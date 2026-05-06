# Phase 5: Polishing & Deployment - Plan

## Goal
Add robust global error handling to the backend, ensure unhandled promise rejections are caught, and configure the application for unified production deployment.

## Tasks

1. **Backend Error Handling**:
   - Create `backend/middleware/errorMiddleware.js` containing `notFound` and `errorHandler` middlewares.
   - The `errorHandler` will format stack traces (hiding them in production) and structure error responses cleanly.
   - Mount these middlewares in `backend/server.js` at the very end of the route definitions.

2. **Unified Deployment Configuration**:
   - Update `backend/server.js` to serve the static frontend bundle from `frontend/dist` when `NODE_ENV === 'production'`.
   - Add a catch-all route `*` to serve `index.html` for client-side routing in production.
   - Create a root `package.json` with scripts:
     - `install`: `npm install --prefix backend && npm install --prefix frontend`
     - `build`: `npm run build --prefix frontend`
     - `start`: `npm start --prefix backend`

3. **Frontend API URL**:
   - Update `frontend/src/api/axios.js` to intelligently fall back to the same origin if `import.meta.env.VITE_API_URL` is undefined (useful for unified deployment).

## Files
- `backend/middleware/errorMiddleware.js`
- `backend/server.js` (update)
- `package.json` (root, new)
- `frontend/src/api/axios.js` (update)
