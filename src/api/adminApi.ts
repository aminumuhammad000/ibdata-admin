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
export const creditUserWallet = (userId: string, amount: number, description: string) =>
  api.post('/wallet/credit', { userId, amount, description });

// Audit Logs
export const getAuditLogs = (params?: { page?: number; limit?: number }) =>
  api.get('/audit-logs', { params });
export const deleteAuditLog = (id: string) => api.delete(`/audit-logs/${id}`);

// Pricing Management
export const getPricingPlans = (params?: { page?: number; limit?: number; providerId?: number; type?: string; active?: boolean }) =>
  api.get('/pricing', { params });
export const getPricingPlanById = (id: string) => api.get(`/pricing/${id}`);
export const getPlansByProvider = (providerId: number, type?: string) =>
  api.get(`/pricing/provider/${providerId}`, { params: { type } });
export const createPricingPlan = (data: any) =>
  api.post('/pricing', data);
export const updatePricingPlan = (id: string, data: any) =>
  api.put(`/pricing/${id}`, data);
export const deletePricingPlan = (id: string) =>
  api.delete(`/pricing/${id}`);
export const bulkImportPricingPlans = (plans: any[]) =>
  api.post('/pricing/bulk-import', { plans });
