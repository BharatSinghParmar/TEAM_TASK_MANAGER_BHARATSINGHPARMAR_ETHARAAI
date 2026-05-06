import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { useAuth } from '../context/AuthContext';
import ProjectModal from '../components/ProjectModal';
import ManageMembersModal from '../components/ManageMembersModal';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchProjectAndTasks();
  }, [id]);

  const fetchProjectAndTasks = async () => {
    try {
      const projectData = await projectService.getProjectById(id);
      setProject(projectData);
      
      const tasksData = await taskService.getTasksByProject(id);
      setTasks(tasksData);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch project details');
      navigate('/projects');
    } finally {
      setLoading(false);
      setTasksLoading(false);
    }
  };

  const handleUpdateProject = async (projectData) => {
    try {
      const updatedProject = await projectService.updateProject(id, projectData);
      setProject({ ...project, ...updatedProject });
      toast.success('Project updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update project');
      throw error;
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await projectService.deleteProject(id);
        toast.success('Project deleted successfully');
        navigate('/projects');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete project');
      }
    }
  };

  const handleAddMember = async (userId) => {
    try {
      const updatedProject = await projectService.addMember(id, userId);
      setProject(updatedProject);
      toast.success('Member added');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      const updatedProject = await projectService.removeMember(id, userId);
      setProject(updatedProject);
      toast.success('Member removed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove member');
    }
  };

  // Task Handlers
  const openCreateTaskModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskSubmit = async (taskData) => {
    try {
      if (editingTask) {
        const updatedTask = await taskService.updateTask(editingTask._id, taskData);
        setTasks(tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
        toast.success('Task updated successfully');
      } else {
        const newTaskData = { ...taskData, project: id };
        const newTask = await taskService.createTask(newTaskData);
        // We might want to fetch all tasks again to get fully populated fields,
        // or just append if populate isn't fully needed until refresh
        const tasksData = await taskService.getTasksByProject(id);
        setTasks(tasksData);
        toast.success('Task created successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save task');
      throw error;
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      const updatedTask = await taskService.updateTask(taskId, { status: newStatus });
      setTasks(tasks.map(t => t._id === taskId ? updatedTask : t));
      toast.success('Task status updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task status');
      // Revert Optimistic UI if failed? The list won't change unless we succeeded, 
      // but the select dropdown might look changed. In React it's controlled by `tasks` state, so it will snap back.
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        setTasks(tasks.filter(t => t._id !== taskId));
        toast.success('Task deleted successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/projects" className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Projects
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-md shadow-slate-200/50 border border-slate-200 overflow-hidden mb-10">
        <div className="bg-gradient-to-r from-slate-50 to-white px-8 py-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{project.name}</h1>
            <p className="text-sm font-medium text-slate-500 mt-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Created by {project.createdBy?.name || 'Unknown'} on {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          {user?.role === 'Admin' && (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-semibold transition-colors shadow-sm"
              >
                Edit Project
              </button>
              <button
                onClick={handleDeleteProject}
                className="px-4 py-2 bg-red-50 border border-red-100 text-red-600 rounded-lg hover:bg-red-100 text-sm font-semibold transition-colors shadow-sm"
              >
                Delete Project
              </button>
            </div>
          )}
        </div>
        
        <div className="p-8 flex flex-col lg:flex-row gap-10">
          <div className="flex-1">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Description</h2>
            <p className="text-slate-700 whitespace-pre-wrap text-base leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">{project.description}</p>
          </div>

          <div className="lg:w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                Team Members ({project.members?.length || 0})
              </h2>
              {user?.role === 'Admin' && (
                <button
                  onClick={() => setIsMembersModalOpen(true)}
                  className="text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg font-semibold transition-colors"
                >
                  Manage Members
                </button>
              )}
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {project.members?.length > 0 ? (
                <ul className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                  {project.members.map(member => (
                    <li key={member._id} className="p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{member.name}</p>
                        <p className="text-xs text-slate-500 truncate">{member.email}</p>
                      </div>
                      {member.role === 'Admin' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                          Admin
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm text-slate-500 italic">No members assigned.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Project Tasks</h2>
          {user?.role === 'Admin' && (
            <button
              onClick={openCreateTaskModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium shadow transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              New Task
            </button>
          )}
        </div>

        {tasksLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {user?.role === 'Admin' ? 'Get started by creating a new task.' : 'You have no assigned tasks in this project.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map(task => (
              <TaskCard 
                key={task._id} 
                task={task} 
                onStatusChange={handleTaskStatusChange}
                onEdit={openEditTaskModal}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>

      <ProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateProject}
        initialData={project}
      />

      <ManageMembersModal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        projectMembers={project.members || []}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleTaskSubmit}
        initialData={editingTask}
        projectMembers={project.members || []}
      />
    </div>
  );
};

export default ProjectDetails;
