import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMemberToProject,
  removeMemberFromProject,
} from '../controllers/projectController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

import { getTasksByProject } from '../controllers/taskController.js';

const router = express.Router();

router.route('/')
  .get(protect, getProjects)
  .post(protect, admin, createProject);

router.route('/:projectId/tasks')
  .get(protect, getTasksByProject);

router.route('/:id')
  .get(protect, getProjectById)
  .put(protect, admin, updateProject)
  .delete(protect, admin, deleteProject);

router.route('/:id/members')
  .post(protect, admin, addMemberToProject);

router.route('/:id/members/:userId')
  .delete(protect, admin, removeMemberFromProject);

export default router;
