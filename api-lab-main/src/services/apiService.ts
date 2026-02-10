import api from './api';

export interface RequestData {
  id?: string;
  name: string;
  method: string;
  url: string;
  headers?: { key: string; value: string }[];
  body?: string;
  auth?: { authType: string; token: string };
  collectionId?: string;
}

export interface CollectionData {
  _id: string;
  name: string;
  description?: string;
}

export interface EnvironmentData {
  _id: string;
  name: string;
  variables: { key: string; value: string }[];
  isActive: boolean;
}

export const apiService = {
  // Requests
  executeRequest: async (config: any) => {
    const response = await api.post('/requests/execute', config);
    return response.data;
  },
  
  saveRequest: async (data: RequestData) => {
    const response = await api.post('/requests/save', data);
    return response.data;
  },
  
  getRequests: async () => {
    const response = await api.get('/requests');
    return response.data;
  },

  getRequest: async (id: string) => {
    const response = await api.get(`/requests/${id}`);
    return response.data;
  },
  
  deleteRequest: async (id: string) => {
    const response = await api.delete(`/requests/${id}`);
    return response.data;
  },

  // Collections
  getCollections: async () => {
    const response = await api.get('/collections');
    return response.data;
  },
  
  createCollection: async (name: string, description?: string) => {
    const response = await api.post('/collections', { name, description });
    return response.data;
  },
  
  updateCollection: async (id: string, name: string, description?: string) => {
    const response = await api.put(`/collections/${id}`, { name, description });
    return response.data;
  },
  
  deleteCollection: async (id: string) => {
    const response = await api.delete(`/collections/${id}`);
    return response.data;
  },

  // Environments
  getEnvironments: async () => {
    const response = await api.get('/environments');
    return response.data;
  },
  
  createEnvironment: async (name: string, variables: { key: string; value: string }[]) => {
    const response = await api.post('/environments', { name, variables });
    return response.data;
  },
  
  updateEnvironment: async (id: string, data: any) => {
    const response = await api.put(`/environments/${id}`, data);
    return response.data;
  },
  
  deleteEnvironment: async (id: string) => {
    const response = await api.delete(`/environments/${id}`);
    return response.data;
  }
};
