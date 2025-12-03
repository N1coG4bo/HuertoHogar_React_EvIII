// Servicio HTTP para operaciones de productos.
import api from './api';

export const productsService = {
  list: () => api.get('/api/productos'),
  get: (id) => api.get(`/api/productos/${id}`),
  create: (body) => api.post('/api/productos', body),
  update: (id, body) => api.put(`/api/productos/${id}`, body),
  remove: (id) => api.delete(`/api/productos/${id}`),
};
