// Servicio HTTP para mensajes.
import api from './api';

export const messagesService = {
  send: (payload) => api.post('/messages', payload),
  inbox: (params) => api.get('/messages/inbox', { params }),
  thread: (email, params) => api.get('/messages/thread', { params: { with: email, ...params } }),
};
