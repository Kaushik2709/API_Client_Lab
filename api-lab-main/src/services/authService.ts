import api from './api';

export const authService = {
  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  signup: async (firstName: string, lastName: string, email: string, password: string) => {
    const response = await api.post('/auth/signup', { firstName, lastName, email, password });
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  updateProfile: async (data: { firstName?: string; lastName?: string; email?: string; password?: string }) => {
    const response = await api.put('/auth/update', data);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete('/auth/delete');
    return response.data;
  }
};
