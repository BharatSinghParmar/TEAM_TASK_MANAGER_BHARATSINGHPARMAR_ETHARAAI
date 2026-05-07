import api from '../api/axios';

const getTasks = async () => {
  const { data } = await api.get('/tasks');
  return data;
};

const getTasksByProject = async (projectId) => {
  const { data } = await api.get(`/projects/${projectId}/tasks`);
  return data;
};

const createTask = async (taskData) => {
  const { data } = await api.post('/tasks', taskData);
  return data;
};

const updateTask = async (id, taskData) => {
  const { data } = await api.put(`/tasks/${id}`, taskData);
  return data;
};

const deleteTask = async (id) => {
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
};

const addTaskComment = async (id, text) => {
  const { data } = await api.post(`/tasks/${id}/comments`, { text });
  return data;
};

export const taskService = {
  getTasks,
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
  addTaskComment,
};
