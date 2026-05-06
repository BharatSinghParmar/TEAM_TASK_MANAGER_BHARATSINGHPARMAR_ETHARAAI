import api from '../api/axios';

const getUsers = async () => {
  const { data } = await api.get('/users');
  return data;
};

export const userService = {
  getUsers,
};
