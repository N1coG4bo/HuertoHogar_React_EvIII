// Servicio HTTP para operaciones de productos.
import api from './api';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

const IMAGE_FALLBACKS = {
  'Manzanas Fuji': '/manzana.jpeg',
  'Naranjas Valencia': '/naranja.jpeg',
  'Platanos Cavendish': '/platanos-cavendish.jpg',
  'Zanahorias Organicas': '/zanahoria.jpg',
  'Espinacas Frescas': '/espinacas.jpg',
  'Pimientos Tricolores': '/pimientos-tricolores.jpeg',
  'Miel Organica 500g': '/miel.jpg',
  'Leche Entera 1L': '/leche-1l.jpg',
};

function resolveImage(uri, nombre) {
  if (uri) {
    if (/^https?:\/\//i.test(uri)) return uri;
    if (uri.startsWith('/uploads/')) return `${API_BASE_URL}${uri}`;
    return uri;
  }
  return IMAGE_FALLBACKS[nombre] || '/img-placeholder.svg';
}

function normalizeProduct(producto) {
  if (!producto) return null;
  const code = producto.code || producto.id || producto._id || '';
  return {
    code,
    nombre: producto.nombre || producto.name || 'Producto',
    precio: Number(producto.precio ?? producto.precioCLP ?? 0),
    unidad: producto.unidad || 'unidad',
    stock: Number(producto.stock ?? 99),
    img: resolveImage(producto.img || producto.imagenUri || '', producto.nombre || producto.name || ''),
    descripcion: producto.descripcion || '',
    categoria: producto.categoria || '',
    providerEmail: producto.providerEmail || producto.proveedorEmail || '',
  };
}

export const productsService = {
  list: () => api.get('/products'),
  get: (id) => api.get(`/products/${id}`),
  create: (body) => api.post('/products', body),
  update: (id, body) => api.put(`/products/${id}`, body),
  remove: (id) => api.delete(`/products/${id}`),
  normalizeProduct,
};
// Normaliza la estructura de un producto.

