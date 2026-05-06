import api from '../api/axios';

const getProjects = async () => {
  const { data } = await api.get('/projects');
  return data;
};

const getProjectById = async (id) => {
  const { data } = await api.get(`/projects/${id}`);
  return data;
};

const createProject = async (projectData) => {
  const { data } = await api.post('/projects', projectData);
  return data;
};

const updateProject = async (id, projectData) => {
  const { data } = await api.put(`/projects/${id}`, projectData);
  return data;
};

const deleteProject = async (id) => {
  const { data } = await api.delete(`/projects/${id}`);
  return data;
};

const addMember = async (projectId, userId) => {
  const { data } = await api.post(`/projects/${projectId}/members`, { userId });
  return data;
};

const removeMember = async (projectId, userId) => {
  const { data } = await api.delete(`/projects/${projectId}/members/${userId}`);
  return data;
};

export const projectService = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
