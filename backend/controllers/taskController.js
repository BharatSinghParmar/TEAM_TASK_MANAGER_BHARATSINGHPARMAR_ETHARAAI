import Task from '../models/Task.js';
import Project from '../models/Project.js';

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private/Admin
export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, project, assignedTo } = req.body;

    if (!title || !description || !dueDate || !project || !assignedTo) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    // Verify project exists
    const existingProject = await Project.findById(project);
    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Verify assignee is a member of the project
    if (!existingProject.members.includes(assignedTo)) {
      return res.status(400).json({ message: 'Assignee must be a member of the project' });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      project,
      assignedTo,
      activityLog: [
        {
          action: 'Task Created',
          user: req.user._id,
        }
      ]
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    let tasks;
    
    // Admins see all tasks, members see only their assigned tasks
    if (req.user.role === 'Admin') {
      tasks = await Task.find()
        .populate('project', 'name')
        .populate('assignedTo', 'name email')
        .populate('comments.user', 'name email')
        .populate('activityLog.user', 'name email');
    } else {
      tasks = await Task.find({ assignedTo: req.user._id })
        .populate('project', 'name')
        .populate('assignedTo', 'name email')
        .populate('comments.user', 'name email')
        .populate('activityLog.user', 'name email');
    }

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get tasks by project ID
// @route   GET /api/projects/:projectId/tasks
// @access  Private
export const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check access: Admin or member of the project
    if (req.user.role !== 'Admin' && !project.members.some(member => member.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to view tasks for this project' });
    }

    let tasks;
    // Admins and members can both see all tasks in the project they have access to
    tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'name email')
      .populate('project', 'name')
      .populate('comments.user', 'name email')
      .populate('activityLog.user', 'name email');

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Members can only update status of their own tasks
    if (req.user.role !== 'Admin') {
      if (task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }

      // If they are a member, they can only update the status
      const { status } = req.body;
      if (status && status !== task.status) {
        const fromStatus = task.status;
        task.status = status;
        task.activityLog.push({
          action: 'Status Changed',
          user: req.user._id,
          fromStatus,
          toStatus: status
        });
        await task.save();
        const updatedTask = await Task.findById(req.params.id)
          .populate('assignedTo', 'name email')
          .populate('project', 'name')
          .populate('comments.user', 'name email')
          .populate('activityLog.user', 'name email');
        return res.json(updatedTask);
      } else if (status === task.status) {
        // Status didn't change, just return ok to prevent 400 error when clicking save
        const existingTask = await Task.findById(req.params.id)
          .populate('assignedTo', 'name email')
          .populate('project', 'name')
          .populate('comments.user', 'name email')
          .populate('activityLog.user', 'name email');
        return res.json(existingTask);
      }
      return res.status(400).json({ message: 'Members can only update task status' });
    }

    // Admin can update anything
    // Check if assignedTo changed, verify member
    if (req.body.assignedTo && req.body.assignedTo !== task.assignedTo?.toString()) {
      const project = await Project.findById(task.project);
      if (!project.members.includes(req.body.assignedTo)) {
        return res.status(400).json({ message: 'Assignee must be a member of the project' });
      }
    }

    // Track activity changes
    if (req.body.status && req.body.status !== task.status) {
      task.activityLog.push({
        action: 'Status Changed',
        user: req.user._id,
        fromStatus: task.status,
        toStatus: req.body.status
      });
    }

    if (req.body.assignedTo && req.body.assignedTo !== task.assignedTo?.toString()) {
      task.activityLog.push({
        action: 'Reassigned',
        user: req.user._id
      });
    }

    // Update fields except activityLog (since we pushed to it)
    if (req.body.title) task.title = req.body.title;
    if (req.body.description) task.description = req.body.description;
    if (req.body.dueDate) task.dueDate = req.body.dueDate;
    if (req.body.status) task.status = req.body.status;
    if (req.body.assignedTo) task.assignedTo = req.body.assignedTo;

    await task.save();

    const updatedTask = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('project', 'name')
      .populate('comments.user', 'name email')
      .populate('activityLog.user', 'name email');

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role !== 'Admin' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to comment on this task' });
    }

    if (!text && !req.file) {
      return res.status(400).json({ message: 'Please add a comment text or an attachment' });
    }

    const newComment = {
      user: req.user._id,
      text: text || '',
    };

    if (req.file) {
      newComment.attachment = {
        filename: req.file.originalname,
        path: `/uploads/comments/${req.file.filename}`,
        mimetype: req.file.mimetype,
        size: req.file.size,
      };
    }

    task.comments.push(newComment);

    task.activityLog.push({
      action: 'Comment Added',
      user: req.user._id,
    });

    await task.save();

    const updatedTask = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('project', 'name')
      .populate('comments.user', 'name email')
      .populate('activityLog.user', 'name email');

    res.status(201).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
