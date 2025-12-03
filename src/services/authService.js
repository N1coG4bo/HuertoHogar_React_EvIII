// Servicio HTTP para autenticacion y gestion de usuarios.
import api from './api';

export const authService = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  register: (payload) => api.post('/api/auth/register', payload),
  getProfile: () => api.get('/api/usuarios/me'),
  updateProfile: (payload) => api.put('/api/usuarios/me', payload),
  listUsers: () => api.get('/api/usuarios'),
  getUser: (id) => api.get(`/api/usuarios/${id}`),
  deleteUser: (id) => api.delete(`/api/usuarios/${id}`),
};
