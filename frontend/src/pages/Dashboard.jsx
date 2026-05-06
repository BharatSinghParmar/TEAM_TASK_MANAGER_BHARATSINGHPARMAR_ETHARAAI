import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { dashboardService } from '../services/dashboardService';
import { taskService } from '../services/taskService'; // if we need to update status directly from dashboard
import DashboardStats from '../components/DashboardStats';
import TaskCard from '../components/TaskCard';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const data = await dashboardService.getDashboardMetrics();
      setMetrics(data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      const updatedTask = await taskService.updateTask(taskId, { status: newStatus });
      // Update local state for recent tasks
      setMetrics((prev) => ({
        ...prev,
        recentTasks: prev.recentTasks.map(t => t._id === taskId ? updatedTask : t)
      }));
      toast.success('Task status updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="mt-2 text-gray-600">
          <p className="text-lg font-medium text-gray-900">Welcome back, {user?.name} 👋</p>
          <p className="text-sm mt-1">
            {user?.role === 'Admin' 
              ? 'Manage your teams and monitor project progress.' 
              : 'Track and update your assigned tasks.'}
          </p>
        </div>
      </div>

      <DashboardStats metrics={metrics} />

      <div className="mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Tasks</h2>
          <Link to="/projects" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition">
            View All Projects &rarr;
          </Link>
        </div>

        {metrics.recentTasks?.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no recent tasks to display.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.recentTasks.map(task => (
              <TaskCard 
                key={task._id} 
                task={task} 
                onStatusChange={handleTaskStatusChange}
                // For Dashboard view, we might not allow edit/delete to keep it simple, or we can just pass empty functions
                // since Admins will usually edit tasks from the Project details view where the project members are available
                onEdit={() => toast.info('Please edit tasks from the Project Details page')}
                onDelete={() => toast.info('Please delete tasks from the Project Details page')}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
