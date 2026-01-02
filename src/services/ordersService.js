// Servicio HTTP para ordenes simples.
import api from './api';

export const ordersService = {
  create: (payload) => api.post('/orders', payload),
};
