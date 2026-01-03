// Servicio HTTP para autenticacion y gestion de usuarios.
import api from './api';

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (payload) => api.post('/auth/register', payload),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  getProfile: () => api.get('/auth/me'),
  listUsers: () => api.get('/users'),
  getUser: (email) => api.get(`/users/${encodeURIComponent(email)}`),
  updateUser: (email, payload) => api.patch(`/users/${encodeURIComponent(email)}`, payload),
  resetPassword: (email, newPassword) => api.post('/auth/reset-password', { email, newPassword }),
  deleteUser: (email) => api.delete(`/users/${encodeURIComponent(email)}`),
  
  // Métodos para recuperación de contraseña
  requestPasswordReset: (email) => api.post('/auth/request-password-reset', { email }),
  verifyResetCode: (email, code) => api.post('/auth/verify-reset-code', { email, code }),
  confirmPasswordReset: (email, code, newPassword) => api.post('/auth/confirm-password-reset', { email, code, newPassword }),
};
