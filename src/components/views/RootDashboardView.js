// Dashboard exclusivo para el usuario root.
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import MainLayout from '../main_layout';
import Footer from '../footer';
import { AuthContext } from '../../context/AuthContext';
import { db } from '../../firebase';
import BeamsBackground from '../BeamsBackground';

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);
}

function formatDate(value) {
  if (!value) return 'Sin registros';
  return new Date(value).toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' });
}

function RootDashboardView() {
  const { user } = React.useContext(AuthContext);
  const [stats, setStats] = useState({
    loading: true,
    error: '',
    users: 0,
    products: 0,
    orders: 0,
    sales: 0,
    latest: null,
    activity: [],
  });

  useEffect(() => {
    let active = true;
    async function loadStats() {
      if (!user || user.role !== 'root') return;
      setStats((prev) => ({ ...prev, loading: true, error: '' }));
      try {
        const [usersSnap, productsSnap, pedidosSnap] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'products')),
          getDocs(collection(db, 'pedidos')),
        ]);
        const pedidos = pedidosSnap.docs.map((docItem) => {
          const data = docItem.data() || {};
          return {
            ...data,
            pedidoId: data.pedidoId || docItem.id,
            fecha: data.fechaPedido || data.ultimaActualizacion || 0,
          };
        });
        const sales = pedidos.reduce((acc, p) => acc + Number(p.totalCLP || 0), 0);
        const latest = pedidos.reduce((acc, p) => (p.fecha > acc ? p.fecha : acc), 0);
        const recentQuery = query(
          collection(db, 'pedidos'),
          orderBy('ultimaActualizacion', 'desc'),
          limit(10)
        );
        const recentSnap = await getDocs(recentQuery);
        const activity = recentSnap.docs.map((docItem) => {
          const data = docItem.data() || {};
          return {
            id: docItem.id,
            pedidoId: data.pedidoId || docItem.id,
            estado: data.estado || 'PENDIENTE',
            compradorEmail: data.compradorEmail || '',
            totalCLP: data.totalCLP || 0,
            fecha: data.ultimaActualizacion || data.fechaPedido || 0,
          };
        });
        if (!active) return;
        setStats({
          loading: false,
          error: '',
          users: usersSnap.size,
          products: productsSnap.size,
          orders: pedidosSnap.size,
          sales,
          latest,
          activity,
        });
      } catch (err) {
        if (!active) return;
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: err?.message || 'No pudimos cargar el dashboard root.',
        }));
      }
    }
    loadStats();
    return () => {
      active = false;
    };
  }, [user]);

  const latestLabel = useMemo(() => formatDate(stats.latest), [stats.latest]);

  if (!user || user.role !== 'root') {
    return (
      <>
        <MainLayout>
          <div className="my-4">
            <div className="alert alert-danger">Debes ser root para ver este dashboard.</div>
          </div>
        </MainLayout>
        <Footer />
      </>
    );
  }

  return (
    <>
      <MainLayout>
        <section className="dashboard-hero root-hero beams-hero mb-4">
          <BeamsBackground className="beams-header-bg" />
          <div>
            <h1 className="dashboard-title">Dashboard Root</h1>
            <p className="dashboard-subtitle">Control total de usuarios, productos y pedidos en la nube.</p>
          </div>
          <div className="dashboard-hero-meta">
            <span className="dashboard-pill">Ultima actividad: {latestLabel}</span>
            <span className="dashboard-pill">Modo cloud en tiempo real</span>
          </div>
        </section>

        {stats.error && <div className="alert alert-danger">{stats.error}</div>}
        {stats.loading ? (
          <div className="alert alert-info">Cargando métricas del root...</div>
        ) : (
          <div className="row g-4">
            <div className="col-12 col-lg-4">
              <div className="dash-card">
                <div className="dash-card-header">
                  <h2>Estadísticas</h2>
                  <span className="dash-card-badge">Firebase</span>
                </div>
                <div className="dash-stats">
                  <div>
                    <span className="dash-stat-label">Usuarios</span>
                    <span className="dash-stat-value">{stats.users}</span>
                  </div>
                  <div>
                    <span className="dash-stat-label">Productos</span>
                    <span className="dash-stat-value">{stats.products}</span>
                  </div>
                  <div>
                    <span className="dash-stat-label">Pedidos</span>
                    <span className="dash-stat-value">{stats.orders}</span>
                  </div>
                  <div>
                    <span className="dash-stat-label">Ventas</span>
                    <span className="dash-stat-value">{formatCurrency(stats.sales)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-8">
              <div className="dash-card">
                <div className="dash-card-header">
                  <h2>Actividad reciente</h2>
                  <span className="dash-card-badge">Pedidos</span>
                </div>
                {stats.activity.length === 0 ? (
                  <p className="text-muted mb-0">Sin actividad registrada.</p>
                ) : (
                  <div className="dash-activity">
                    {stats.activity.map((item) => (
                      <div key={item.id} className="dash-activity-row">
                        <div>
                          <strong>{item.pedidoId}</strong>
                          <div className="text-muted small">{item.compradorEmail || 'Comprador'}</div>
                        </div>
                        <div className="text-end">
                          <div className="dash-status">{item.estado}</div>
                          <div className="text-muted small">{formatCurrency(item.totalCLP)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="dash-card">
                <div className="dash-card-header">
                  <h2>Gestión rápida</h2>
                  <span className="dash-card-badge">Accesos</span>
                </div>
                <div className="dash-actions">
                  <Link className="btn btn-success" to="/admin/usuarios">Gestionar usuarios</Link>
                  <Link className="btn btn-outline-success" to="/productos">Ver catálogo</Link>
                  <Link className="btn btn-outline-success" to="/pedidos">Pedidos en vivo</Link>
                  <Link className="btn btn-outline-success" to="/admin/dashboard">Panel admin</Link>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="dash-card">
                <div className="dash-card-header">
                  <h2>Sincronización</h2>
                  <span className="dash-card-badge">Estado</span>
                </div>
                <div className="dash-sync">
                  <div>
                    <span className="dash-stat-label">Nube</span>
                    <span className="dash-stat-value">Activa</span>
                  </div>
                  <div>
                    <span className="dash-stat-label">Ultima actualización</span>
                    <span className="dash-stat-value">{latestLabel}</span>
                  </div>
                </div>
                <p className="text-muted mt-3 mb-0">
                  La web trabaja en tiempo real con Firebase, sin necesidad de sincronización manual.
                </p>
              </div>
            </div>
          </div>
        )}
      </MainLayout>
      <Footer />
    </>
  );
}

export default RootDashboardView;
