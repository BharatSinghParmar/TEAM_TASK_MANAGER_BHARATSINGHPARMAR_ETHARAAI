import Project from '../models/Project.js';
import Task from '../models/Task.js';

// @desc    Get dashboard metrics
// @route   GET /api/dashboard
// @access  Private
export const getDashboardMetrics = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'Admin';
    const userId = req.user._id;

    let totalProjects = 0;
    let pendingTasks = 0;
    let inProgressTasks = 0;
    let completedTasks = 0;
    let recentTasks = [];

    if (isAdmin) {
      totalProjects = await Project.countDocuments();
      
      pendingTasks = await Task.countDocuments({ status: 'Pending' });
      inProgressTasks = await Task.countDocuments({ status: 'In Progress' });
      completedTasks = await Task.countDocuments({ status: 'Completed' });

      recentTasks = await Task.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('project', 'name')
        .populate('assignedTo', 'name email');
    } else {
      totalProjects = await Project.countDocuments({ members: userId });
      
      pendingTasks = await Task.countDocuments({ assignedTo: userId, status: 'Pending' });
      inProgressTasks = await Task.countDocuments({ assignedTo: userId, status: 'In Progress' });
      completedTasks = await Task.countDocuments({ assignedTo: userId, status: 'Completed' });

      recentTasks = await Task.find({ assignedTo: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('project', 'name')
        .populate('assignedTo', 'name email');
    }

    const totalTasks = pendingTasks + inProgressTasks + completedTasks;

    res.json({
      projects: totalProjects,
      tasks: {
        total: totalTasks,
        pending: pendingTasks,
        inProgress: inProgressTasks,
        completed: completedTasks,
      },
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
