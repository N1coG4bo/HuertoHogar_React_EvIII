// Dashboard admin con métricas reales de ventas.
import React, { useEffect, useMemo, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import MainLayout from '../main_layout';
import Footer from '../footer';
import ChromaGrid from '../ChromaGrid';
import { AuthContext } from '../../context/AuthContext';
import { ProductsContext } from '../../context/ProductsContext';
import { db } from '../../firebase';
import BeamsBackground from '../BeamsBackground';

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);
}

function getInitials(name = '') {
  const parts = name.split(' ').filter(Boolean);
  const [a = '', b = ''] = parts;
  return `${a[0] || ''}${b[0] || ''}`.toUpperCase();
}

function buildPath(data, key, width, height, maxValue) {
  if (!data.length) return '';
  const step = width / Math.max(1, data.length - 1);
  return data
    .map((d, i) => {
      const x = i * step;
      const y = height - (d[key] / maxValue) * (height * 0.85);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

function AreaChart({ data }) {
  const width = 360;
  const height = 170;
  const maxValue = Math.max(...data.map((d) => Math.max(d.ventas, d.ingresos)), 1);
  const pathVentas = buildPath(data, 'ventas', width, height, maxValue);
  const pathIngresos = buildPath(data, 'ingresos', width, height, maxValue);
  const areaPath = `${pathIngresos} L ${width} ${height} L 0 ${height} Z`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-100">
      <path d={areaPath} fill="rgba(31,122,56,0.18)" />
      <path d={pathIngresos} stroke="rgba(31,122,56,0.8)" strokeWidth="4" fill="none" />
      <path d={pathVentas} stroke="rgba(255, 209, 102, 0.9)" strokeWidth="3" fill="none" strokeDasharray="6 6" />
    </svg>
  );
}

function StatusBars({ data }) {
  const height = 160;
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="d-flex align-items-end justify-content-between gap-2" style={{ height }}>
      {data.map((d) => (
        <div key={d.label} className="text-center flex-fill">
          <div
            className="dash-bar"
            style={{
              height: `${(d.value / maxValue) * (height - 40)}px`,
              background: d.color,
            }}
          />
          <small className="d-block mt-2 text-muted" style={{ fontSize: 11 }}>{d.label}</small>
          <span className="dash-bar-value">{d.value}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ data }) {
  const total = data.reduce((acc, d) => acc + d.valor, 0) || 1;
  let offset = 0;
  const radius = 76;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="d-flex flex-column align-items-center">
      <svg viewBox="0 0 220 220" style={{ maxWidth: 230 }}>
        {data.map((d) => {
          const dash = (d.valor / total) * circumference;
          const circle = (
            <circle
              key={d.label}
              cx="110"
              cy="110"
              r={radius}
              fill="transparent"
              stroke={d.color}
              strokeWidth="30"
              strokeDasharray={`${dash} ${circumference}`}
              strokeDashoffset={-offset}
            />
          );
          offset += dash;
          return circle;
        })}
        <circle cx="110" cy="110" r="56" fill="#fffaf0" />
      </svg>
      <div className="d-flex flex-wrap justify-content-center gap-2 mt-2">
        {data.map((d) => (
          <span key={d.label} className="badge bg-light text-dark border">
            <span className="me-1" style={{ color: d.color }}>●</span>
            {d.label} ({Math.round((d.valor / total) * 100)}%)
          </span>
        ))}
      </div>
    </div>
  );
}

function AdminDashboardView() {
  const { isAdmin, users } = React.useContext(AuthContext);
  const { products, loading: productsLoading, error: productsError, refresh } = React.useContext(ProductsContext);
  const [salesState, setSalesState] = useState({ loading: true, error: '', pedidos: [] });

  useEffect(() => {
    let active = true;
    async function loadSales() {
      if (!isAdmin) return;
      setSalesState({ loading: true, error: '', pedidos: [] });
      try {
        const snapshot = await getDocs(collection(db, 'pedidos'));
        const pedidos = snapshot.docs.map((docItem) => {
          const data = docItem.data() || {};
          return {
            ...data,
            pedidoId: data.pedidoId || docItem.id,
            fecha: data.fechaPedido || data.ultimaActualizacion || 0,
          };
        });
        if (!active) return;
        setSalesState({ loading: false, error: '', pedidos });
      } catch (err) {
        if (!active) return;
        setSalesState({ loading: false, error: err?.message || 'No pudimos cargar las ventas', pedidos: [] });
      }
    }
    loadSales();
    return () => {
      active = false;
    };
  }, [isAdmin]);

  const salesMetrics = useMemo(() => {
    const pedidos = salesState.pedidos || [];
    const totalSales = pedidos.reduce((acc, p) => acc + Number(p.totalCLP || 0), 0);
    const totalOrders = pedidos.length;
    const avgTicket = totalOrders ? Math.round(totalSales / totalOrders) : 0;
    const delivered = pedidos.filter((p) => p.estado === 'ENTREGADO').length;
    const canceled = pedidos.filter((p) => p.estado === 'CANCELADO').length;
    const pending = pedidos.filter((p) => !['ENTREGADO', 'CANCELADO'].includes(p.estado)).length;
    const latestOrders = [...pedidos]
      .sort((a, b) => (b.fecha || 0) - (a.fecha || 0))
      .slice(0, 5);
    return {
      totalSales,
      totalOrders,
      avgTicket,
      delivered,
      pending,
      canceled,
      latestOrders,
    };
  }, [salesState.pedidos]);

  const monthlyData = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, idx) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        mes: MONTHS[date.getMonth()],
        ventas: 0,
        ingresos: 0,
      };
    });
    const monthMap = months.reduce((acc, m) => {
      acc[m.key] = m;
      return acc;
    }, {});
    salesState.pedidos.forEach((p) => {
      if (!p.fecha) return;
      const date = new Date(p.fecha);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!monthMap[key]) return;
      monthMap[key].ventas += 1;
      monthMap[key].ingresos += Number(p.totalCLP || 0);
    });
    return months;
  }, [salesState.pedidos]);

  const statusData = useMemo(
    () => [
      { label: 'Pendientes', value: salesMetrics.pending, color: 'linear-gradient(180deg,#ffbe76,#f0932b)' },
      { label: 'Entregados', value: salesMetrics.delivered, color: 'linear-gradient(180deg,#6ab04c,#2ecc71)' },
      { label: 'Cancelados', value: salesMetrics.canceled, color: 'linear-gradient(180deg,#ff7979,#eb4d4b)' },
    ],
    [salesMetrics]
  );

  const donutData = useMemo(() => {
    if (!products.length) return [];
    const totals = products.reduce(
      (acc, p) => {
        if (p.categoria) {
          if (p.categoria.toLowerCase() === 'bienestar') acc.bienestar += 1;
          else if (p.categoria.toLowerCase() === 'cuidado') acc.cuidado += 1;
          else if (p.categoria.toLowerCase() === 'tecnologia') acc.tecnologia += 1;
          else if (p.categoria.toLowerCase() === 'accesorios') acc.accesorios += 1;
        } else {
          const prefix = p.code.substring(0, 2);
          if (prefix === 'FR') acc.bienestar += 1;
          else if (prefix === 'VR') acc.cuidado += 1;
          else if (prefix === 'PO') acc.tecnologia += 1;
          else if (prefix === 'PL') acc.accesorios += 1;
        }
        return acc;
      },
      { bienestar: 0, cuidado: 0, tecnologia: 0, accesorios: 0 }
    );
    return [
      { label: 'Bienestar', valor: totals.bienestar, color: '#20c997' },
      { label: 'Cuidado Personal', valor: totals.cuidado, color: '#f6c453' },
      { label: 'Tecnologia', valor: totals.tecnologia, color: '#0dcaf0' },
      { label: 'Accesorios', valor: totals.accesorios, color: '#ff7979' },
    ].filter((d) => d.valor > 0);
  }, [products]);

  return (
    <>
      <MainLayout>
        <section className="dashboard-hero admin-hero beams-hero mb-4">
          <BeamsBackground className="beams-header-bg" />
          <div>
            <h1 className="dashboard-title">Panel de ventas</h1>
            <p className="dashboard-subtitle">Una vista clara del rendimiento comercial en tiempo real.</p>
          </div>
          <div className="dashboard-hero-meta">
            <span className="dashboard-pill">Ingresos totales: {formatCurrency(salesMetrics.totalSales)}</span>
            <span className="dashboard-pill">Pedidos: {salesMetrics.totalOrders}</span>
          </div>
        </section>

        {!isAdmin ? (
          <div className="alert alert-danger">Debes ser administrador para ver esta sección.</div>
        ) : productsLoading || salesState.loading ? (
          <div className="alert alert-info">Cargando métricas...</div>
        ) : salesState.error ? (
          <div className="alert alert-danger">{salesState.error}</div>
        ) : productsError ? (
          <div className="alert alert-danger d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2">
            <span>Error al cargar productos: {productsError}</span>
            <button className="btn btn-outline-light btn-sm" onClick={refresh}>Reintentar</button>
          </div>
        ) : (
          <>
            <div className="row g-4 mb-4">
              <div className="col-12 col-md-6 col-xl-3">
                <div className="metric-card">
                  <span className="metric-label">Ventas totales</span>
                  <strong className="metric-value">{formatCurrency(salesMetrics.totalSales)}</strong>
                  <span className="metric-note">+{salesMetrics.totalOrders} pedidos</span>
                </div>
              </div>
              <div className="col-12 col-md-6 col-xl-3">
                <div className="metric-card">
                  <span className="metric-label">Ticket promedio</span>
                  <strong className="metric-value">{formatCurrency(salesMetrics.avgTicket)}</strong>
                  <span className="metric-note">Promedio por pedido</span>
                </div>
              </div>
              <div className="col-12 col-md-6 col-xl-3">
                <div className="metric-card">
                  <span className="metric-label">Entregados</span>
                  <strong className="metric-value">{salesMetrics.delivered}</strong>
                  <span className="metric-note">Pedidos completados</span>
                </div>
              </div>
              <div className="col-12 col-md-6 col-xl-3">
                <div className="metric-card">
                  <span className="metric-label">Pendientes</span>
                  <strong className="metric-value">{salesMetrics.pending}</strong>
                  <span className="metric-note">En proceso</span>
                </div>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-12 col-lg-7">
                <div className="dash-card">
                  <div className="dash-card-header">
                    <h2>Ventas y pedidos (6 meses)</h2>
                    <span className="dash-card-badge">Ingresos vs pedidos</span>
                  </div>
                  <AreaChart data={monthlyData} />
                </div>
              </div>
              <div className="col-12 col-lg-5">
                <div className="dash-card">
                  <div className="dash-card-header">
                    <h2>Estado de pedidos</h2>
                    <span className="dash-card-badge">Resumen rápido</span>
                  </div>
                  <StatusBars data={statusData} />
                </div>
              </div>
              <div className="col-12 col-lg-5">
                <div className="dash-card">
                  <div className="dash-card-header">
                    <h2>Categorías destacadas</h2>
                    <span className="dash-card-badge">Inventario</span>
                  </div>
                  <DonutChart data={donutData} />
                </div>
              </div>
              <div className="col-12 col-lg-7">
                <div className="dash-card">
                  <div className="dash-card-header">
                    <h2>Pedidos recientes</h2>
                    <span className="dash-card-badge">Últimos movimientos</span>
                  </div>
                  {salesMetrics.latestOrders.length === 0 ? (
                    <p className="text-muted mb-0">Aún no hay pedidos registrados.</p>
                  ) : (
                    <div className="dash-activity">
                      {salesMetrics.latestOrders.map((pedido) => (
                        <div key={pedido.pedidoId} className="dash-activity-row">
                          <div>
                            <strong>{pedido.pedidoId}</strong>
                            <div className="text-muted small">{pedido.compradorEmail || 'Comprador'}</div>
                          </div>
                          <div className="text-end">
                            <div className="dash-status">{pedido.estado || 'Pendiente'}</div>
                            <div className="text-muted small">{formatCurrency(pedido.totalCLP || 0)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sección de usuarios destacados con ChromaGrid */}
            {users && users.length > 0 && (
              <div className="row g-4 mt-2">
                <div className="col-12">
                  <div className="dash-card">
                    <div className="dash-card-header mb-3">
                      <h2>Usuarios del Sistema</h2>
                      <Link to="/admin/usuarios" className="btn btn-sm btn-outline-success">
                        Ver todos →
                      </Link>
                    </div>
                    <ChromaGrid
                      items={users.slice(0, 6).map((u) => ({
                        id: u.email,
                        email: u.email,
                        name: u.name || 'Sin nombre',
                        username: u.email.split('@')[0],
                        role: u.role === 'admin' ? 'Administrador' : u.role === 'root' ? 'Root' : 'Cliente',
                        rut: u.rut || 'RUT no registrado',
                        image: getInitials(u.name || u.email),
                        actions: (
                          <div className="d-flex gap-2 mt-2">
                            <Link
                              to={`/admin/usuarios/${encodeURIComponent(u.email)}`}
                              className="btn btn-primary btn-sm"
                            >
                              Ver perfil →
                            </Link>
                          </div>
                        ),
                      }))}
                      radius={260}
                      damping={0.4}
                      fadeOut={0.5}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </MainLayout>
      <Footer />
    </>
  );
}

export default AdminDashboardView;
