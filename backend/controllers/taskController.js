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
        .populate('assignedTo', 'name email');
    } else {
      tasks = await Task.find({ assignedTo: req.user._id })
        .populate('project', 'name')
        .populate('assignedTo', 'name email');
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
    if (req.user.role === 'Admin') {
      tasks = await Task.find({ project: projectId })
        .populate('assignedTo', 'name email')
        .populate('project', 'name');
    } else {
      tasks = await Task.find({ project: projectId, assignedTo: req.user._id })
        .populate('assignedTo', 'name email')
        .populate('project', 'name');
    }

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
      if (status) {
        task.status = status;
        await task.save();
        const updatedTask = await Task.findById(req.params.id)
          .populate('assignedTo', 'name email')
          .populate('project', 'name');
        return res.json(updatedTask);
      }
      return res.status(400).json({ message: 'Members can only update task status' });
    }

    // Admin can update anything
    // Check if assignedTo changed, verify member
    if (req.body.assignedTo && req.body.assignedTo !== task.assignedTo.toString()) {
      const project = await Project.findById(task.project);
      if (!project.members.includes(req.body.assignedTo)) {
        return res.status(400).json({ message: 'Assignee must be a member of the project' });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('assignedTo', 'name email').populate('project', 'name');

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
