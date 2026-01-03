// Servicio Firebase para el ciclo de pedidos.
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import { getStoredUser } from './authStorage';

function getCurrentUser() {
  const stored = getStoredUser();
  if (!stored?.email) {
    throw new Error('Debes iniciar sesion para ver pedidos');
  }
  return stored;
}

function getCurrentUserSafe() {
  try {
    return getCurrentUser();
  } catch (err) {
    return null;
  }
}

function normalizePedido(docItem) {
  const data = docItem.data() || {};
  return {
    ...data,
    pedidoId: data.pedidoId || docItem.id,
    fechaPedido: data.fechaPedido || data.ultimaActualizacion || 0,
  };
}

async function updateEstadoPedido(pedidoId, estado, extra = {}) {
  const now = Date.now();
  await updateDoc(doc(db, 'pedidos', pedidoId), {
    estado,
    ultimaActualizacion: now,
    ...extra,
  });
}

export const pedidosService = {
  create: async (payload) => {
    const currentUser = getCurrentUser();
    const now = Date.now();
    const pedidoRef = doc(collection(db, 'pedidos'));
    const detalleJson = Array.isArray(payload.detalleJson)
      ? JSON.stringify(payload.detalleJson)
      : payload.detalleJson || '';
    const pedido = {
      pedidoId: payload.pedidoId || pedidoRef.id,
      compradorEmail: payload.compradorEmail || currentUser.email,
      compradorNombre: payload.compradorNombre || currentUser.name || currentUser.email,
      proveedorEmail: payload.proveedorEmail || '',
      detalleJson,
      totalCLP: Number(payload.totalCLP || 0),
      estado: payload.estado || 'PENDIENTE',
      fechaPedido: payload.fechaPedido || now,
      ultimaActualizacion: payload.ultimaActualizacion || now,
      metodoPago: payload.metodoPago || null,
      datosTransferencia: payload.datosTransferencia || null,
      direccionEntrega: payload.direccionEntrega || null,
      fechaDespacho: payload.fechaDespacho || null,
      fechaEntrega: payload.fechaEntrega || null,
    };
    await setDoc(pedidoRef, pedido);
    return { data: pedido };
  },
  listMis: async () => {
    const currentUser = getCurrentUser();
    const q = query(
      collection(db, 'pedidos'),
      where('compradorEmail', '==', currentUser.email),
      orderBy('ultimaActualizacion', 'desc')
    );
    const snapshot = await getDocs(q);
    return { data: { pedidos: snapshot.docs.map(normalizePedido) } };
  },
  listProveedor: async () => {
    const currentUser = getCurrentUser();
    const q = query(
      collection(db, 'pedidos'),
      where('proveedorEmail', '==', currentUser.email),
      orderBy('ultimaActualizacion', 'desc')
    );
    const snapshot = await getDocs(q);
    return { data: { pedidos: snapshot.docs.map(normalizePedido) } };
  },
  listenMis: (onUpdate) => {
    const currentUser = getCurrentUserSafe();
    if (!currentUser) return () => {};
    const q = query(
      collection(db, 'pedidos'),
      where('compradorEmail', '==', currentUser.email),
      orderBy('ultimaActualizacion', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      onUpdate(snapshot.docs.map(normalizePedido));
    });
  },
  listenProveedor: (onUpdate) => {
    const currentUser = getCurrentUserSafe();
    if (!currentUser) return () => {};
    const q = query(
      collection(db, 'pedidos'),
      where('proveedorEmail', '==', currentUser.email),
      orderBy('ultimaActualizacion', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      onUpdate(snapshot.docs.map(normalizePedido));
    });
  },
  getById: async (pedidoId) => {
    const snapshot = await getDoc(doc(db, 'pedidos', pedidoId));
    if (!snapshot.exists()) return { data: null };
    return { data: normalizePedido(snapshot) };
  },
  updateMetodoPago: (pedidoId, payload) =>
    updateEstadoPedido(pedidoId, payload?.estado || 'ESPERANDO_PAGO', {
      metodoPago: payload?.metodoPago || null,
      datosTransferencia: payload?.datosTransferencia || null,
    }),
  updateEstado: (pedidoId, payload) => updateEstadoPedido(pedidoId, payload?.estado || 'PENDIENTE', payload || {}),
  confirmar: (pedidoId) => updateEstadoPedido(pedidoId, 'CONFIRMADO'),
  marcarPagado: (pedidoId) => updateEstadoPedido(pedidoId, 'PAGADO'),
  marcarListoDespacho: (pedidoId) => updateEstadoPedido(pedidoId, 'LISTO_DESPACHO', { fechaDespacho: Date.now() }),
  marcarEnCamino: (pedidoId) => updateEstadoPedido(pedidoId, 'EN_CAMINO'),
  marcarEntregado: (pedidoId) => updateEstadoPedido(pedidoId, 'ENTREGADO', { fechaEntrega: Date.now() }),
  cancelar: (pedidoId, payload) =>
    updateEstadoPedido(pedidoId, 'CANCELADO', { motivo: payload?.motivo || '' }),
  countPendientes: async () => {
    const currentUser = getCurrentUser();
    const q = query(
      collection(db, 'pedidos'),
      where('proveedorEmail', '==', currentUser.email),
      where('estado', '==', 'PENDIENTE')
    );
    const snapshot = await getDocs(q);
    return { data: { total: snapshot.size } };
  },
  countNotificaciones: async () => {
    const currentUser = getCurrentUser();
    const q = query(
      collection(db, 'pedidos'),
      where('compradorEmail', '==', currentUser.email),
      where('estado', 'in', ['PAGADO', 'LISTO_DESPACHO', 'EN_CAMINO'])
    );
    const snapshot = await getDocs(q);
    return { data: { total: snapshot.size } };
  },
};
