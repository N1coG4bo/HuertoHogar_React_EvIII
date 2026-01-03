// Vista para el ciclo de pedidos.
import React, { useEffect, useMemo, useState } from 'react';
import MainLayout from '../main_layout';
import Footer from '../footer';
import { AuthContext } from '../../context/AuthContext';
import { pedidosService } from '../../services/pedidosService';
import PageHeader from '../page_header';

function formatMoney(value) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);
}

const ESTADOS_LABEL = {
  PENDIENTE: 'Pendiente',
  CONFIRMADO: 'Confirmado',
  ESPERANDO_PAGO: 'Esperando pago',
  PAGADO: 'Pagado',
  LISTO_DESPACHO: 'Listo despacho',
  EN_CAMINO: 'En camino',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
};

function PedidosView() {
  const { user } = React.useContext(AuthContext);
  const [misPedidos, setMisPedidos] = useState([]);
  const [proveedorPedidos, setProveedorPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('mis');

  const isProveedor = ['provider', 'admin', 'root'].includes(user?.role);

  const refresh = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const [{ data: mis }, { data: prov }] = await Promise.all([
        pedidosService.listMis(),
        isProveedor ? pedidosService.listProveedor() : Promise.resolve({ data: { pedidos: [] } }),
      ]);
      setMisPedidos(mis.pedidos || []);
      setProveedorPedidos(prov.pedidos || []);
    } catch (err) {
      setError(err?.response?.data?.error || 'No pudimos cargar pedidos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    const unsubscribeMis = pedidosService.listenMis((nextMis) => {
      setMisPedidos(nextMis);
    });
    const unsubscribeProveedor = isProveedor
      ? pedidosService.listenProveedor((nextProv) => {
        setProveedorPedidos(nextProv);
      })
      : () => {};
    return () => {
      unsubscribeMis();
      unsubscribeProveedor();
    };
  }, [user, isProveedor]);

  const pedidosActivos = tab === 'mis' ? misPedidos : proveedorPedidos;

  const handleAction = async (action, pedidoId) => {
    setError('');
    try {
      if (action === 'confirmar') await pedidosService.confirmar(pedidoId);
      if (action === 'pagado') await pedidosService.marcarPagado(pedidoId);
      if (action === 'listo') await pedidosService.marcarListoDespacho(pedidoId);
      if (action === 'camino') await pedidosService.marcarEnCamino(pedidoId);
      if (action === 'entregado') await pedidosService.marcarEntregado(pedidoId);
      if (action === 'cancelar') await pedidosService.cancelar(pedidoId, { motivo: 'Cancelado por usuario' });
    } catch (err) {
      setError(err?.response?.data?.error || 'No pudimos actualizar el pedido.');
    }
  };

  const actionsByPedido = useMemo(() => (pedido) => {
    const estado = pedido.estado;
    if (tab === 'mis') {
      if (estado === 'PENDIENTE') return [{ key: 'cancelar', label: 'Cancelar' }];
      if (estado === 'CONFIRMADO' || estado === 'ESPERANDO_PAGO') return [{ key: 'pagado', label: 'Marcar pagado' }];
      if (estado === 'EN_CAMINO') return [{ key: 'entregado', label: 'Confirmar entrega' }];
      return [];
    }
    if (estado === 'PENDIENTE') return [{ key: 'confirmar', label: 'Confirmar' }, { key: 'cancelar', label: 'Cancelar' }];
    if (estado === 'PAGADO') return [{ key: 'listo', label: 'Listo despacho' }];
    if (estado === 'LISTO_DESPACHO') return [{ key: 'camino', label: 'En camino' }];
    return [];
  }, [tab]);

  if (!user) {
    return (
      <>
        <MainLayout>
          <PageHeader titulo="Pedidos" />
          <div className="my-4">
            <div className="alert alert-warning">Inicia sesion para ver tus pedidos.</div>
          </div>
        </MainLayout>
        <Footer />
      </>
    );
  }

  return (
    <>
      <MainLayout>
        <PageHeader
          titulo="Pedidos"
          actions={<button className="btn btn-outline-light btn-sm" onClick={refresh}>Actualizar</button>}
        />
        <div className="my-4">

          {error && <div className="alert alert-danger">{error}</div>}
          {loading && <div className="alert alert-info">Cargando pedidos...</div>}

          <div className="btn-group mb-3" role="group">
            <button
              className={`btn btn-sm ${tab === 'mis' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setTab('mis')}
            >
              Mis compras
            </button>
            {isProveedor && (
              <button
                className={`btn btn-sm ${tab === 'proveedor' ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => setTab('proveedor')}
              >
                Pedidos proveedor
              </button>
            )}
          </div>

          {pedidosActivos.length === 0 ? (
            <div className="alert alert-info">No hay pedidos para mostrar.</div>
          ) : (
            <div className="row g-3">
              {pedidosActivos.map((pedido) => (
                <div className="col-12" key={pedido.pedidoId}>
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                          <strong>{pedido.pedidoId}</strong>
                          <span className="badge bg-light text-dark ms-2">{ESTADOS_LABEL[pedido.estado] || pedido.estado}</span>
                        </div>
                        <strong className="text-success">{formatMoney(pedido.totalCLP || 0)}</strong>
                      </div>
                      <p className="text-muted mb-2">
                        Comprador: {pedido.compradorNombre || pedido.compradorEmail}
                      </p>
                      <div className="d-flex gap-2 flex-wrap">
                        {actionsByPedido(pedido).map((action) => (
                          <button
                            key={action.key}
                            className="btn btn-outline-success btn-sm"
                            onClick={() => handleAction(action.key, pedido.pedidoId)}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </MainLayout>
      <Footer />
    </>
  );
}

export default PedidosView;
