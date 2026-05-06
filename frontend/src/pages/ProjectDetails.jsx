import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { projectService } from '../services/projectService';
import { useAuth } from '../context/AuthContext';
import ProjectModal from '../components/ProjectModal';
import ManageMembersModal from '../components/ManageMembersModal';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const data = await projectService.getProjectById(id);
      setProject(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch project');
      navigate('/projects');
    } finally {
      setLoading(false);
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Created by {project.createdBy?.name || 'Unknown'} on {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          {user?.role === 'Admin' && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm font-medium transition"
              >
                Edit
              </button>
              <button
                onClick={handleDeleteProject}
                className="px-3 py-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 text-sm font-medium transition"
              >
                Delete
              </button>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Team Members ({project.members?.length || 0})
              </h2>
              {user?.role === 'Admin' && (
                <button
                  onClick={() => setIsMembersModalOpen(true)}
                  className="text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md font-medium transition"
                >
                  Manage Members
                </button>
              )}
            </div>
            
            <div className="bg-gray-50 rounded-lg border border-gray-200">
              {project.members?.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {project.members.map(member => (
                    <li key={member._id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.email}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="p-4 text-sm text-gray-500 italic">No members assigned to this project yet.</p>
              )}
            </div>
          </div>
        </div>
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
    </div>
  );
};

export default ProjectDetails;
