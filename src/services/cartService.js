// Servicio HTTP para operaciones del carrito.
import api from './api';

export const cartService = {
  getCart: () => api.get('/cart'),
  upsertItem: ({ productId, qty }) => api.post('/cart/items', { productId, qty }),
  deleteItem: (productId) => api.delete(`/cart/items/${encodeURIComponent(productId)}`),
  clearCart: () => api.post('/cart/clear'),
};
