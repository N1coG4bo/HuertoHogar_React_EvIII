// Servicio HTTP para el ciclo de pedidos.
import api from './api';

export const pedidosService = {
  create: (payload) => api.post('/pedidos', payload),
  listMis: (params) => api.get('/pedidos/mis', { params }),
  listProveedor: (params) => api.get('/pedidos/proveedor', { params }),
  listProveedorPendientes: (params) => api.get('/pedidos/proveedor/pendientes', { params }),
  listProveedorListos: (params) => api.get('/pedidos/proveedor/listos-despacho', { params }),
  getById: (pedidoId) => api.get(`/pedidos/${encodeURIComponent(pedidoId)}`),
  updateMetodoPago: (pedidoId, payload) => api.patch(`/pedidos/${encodeURIComponent(pedidoId)}/metodo-pago`, payload),
  updateEstado: (pedidoId, payload) => api.patch(`/pedidos/${encodeURIComponent(pedidoId)}/estado`, payload),
  confirmar: (pedidoId) => api.post(`/pedidos/${encodeURIComponent(pedidoId)}/confirmar`),
  marcarPagado: (pedidoId) => api.post(`/pedidos/${encodeURIComponent(pedidoId)}/pagado`),
  marcarListoDespacho: (pedidoId) => api.post(`/pedidos/${encodeURIComponent(pedidoId)}/listo-despacho`),
  marcarEnCamino: (pedidoId) => api.post(`/pedidos/${encodeURIComponent(pedidoId)}/en-camino`),
  marcarEntregado: (pedidoId) => api.post(`/pedidos/${encodeURIComponent(pedidoId)}/entregado`),
  cancelar: (pedidoId, payload) => api.post(`/pedidos/${encodeURIComponent(pedidoId)}/cancelar`, payload),
  countPendientes: () => api.get('/pedidos/counts/pendientes'),
  countNotificaciones: () => api.get('/pedidos/counts/notificaciones'),
};
