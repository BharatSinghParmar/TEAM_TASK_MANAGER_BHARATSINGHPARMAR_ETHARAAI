import api from '../api/axios';

const getDashboardMetrics = async () => {
  const { data } = await api.get('/dashboard');
  return data;
};

export const dashboardService = {
  getDashboardMetrics,
};
