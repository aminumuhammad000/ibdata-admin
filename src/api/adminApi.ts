import api from './axios';

// Auth
export const login = (data: { email: string; password: string }) =>
  api.post('/login', data);

// Dashboard
export const getDashboardStats = () => api.get('/dashboard');

// Users
export const getUsers = (params?: { page?: number; limit?: number }) =>
  api.get('/users', { params });
export const getUser = (id: string) => api.get(`/users/${id}`);
export const updateUser = (id: string, data: any) => api.put(`/users/${id}`, data);
export const updateUserStatus = (id: string, status: string) =>
  api.put(`/users/${id}/status`, { status });
export const deleteUser = (id: string) => api.delete(`/users/${id}`);

// Audit Logs
export const getAuditLogs = (params?: { page?: number; limit?: number }) =>
  api.get('/audit-logs', { params });
export const deleteAuditLog = (id: string) => api.delete(`/audit-logs/${id}`);
