// Servicio HTTP para comunidad (solicitudes y amigos).
import api from './api';

export const socialService = {
  sendRequest: (payload) => api.post('/social/requests', payload),
  incoming: () => api.get('/social/requests/incoming'),
  outgoing: () => api.get('/social/requests/outgoing'),
  accept: (id) => api.post(`/social/requests/${encodeURIComponent(id)}/accept`),
  reject: (id) => api.post(`/social/requests/${encodeURIComponent(id)}/reject`),
  friends: () => api.get('/social/friends'),
};
