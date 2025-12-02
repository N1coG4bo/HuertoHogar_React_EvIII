import React, { useMemo } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Sidebar from '../components/sidebar';
import { AuthContext } from '../context/AuthContext';
import { PRODUCTOS } from '../data/productos';

function Card({ title, children, colorClass = 'bg-primary', legend }) {
  return (
    <div className="card shadow-sm h-100">
      <div className={`card-header ${colorClass} text-white py-2 d-flex justify-content-between align-items-center`}>
        <strong>{title}</strong>
        <span className="text-white-50" style={{ fontSize: 12 }}>{legend || ''}</span>
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}

function buildPath(data, key, width, height, maxValue) {
  if (!data.length) return '';
  const step = width / Math.max(1, data.length - 1);
  return data
    .map((d, i) => {
      const x = i * step;
      const y = height - (d[key] / maxValue) * (height * 0.9);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

function AreaChart({ data }) {
  const width = 320;
  const height = 160;
  const maxValue = Math.max(...data.map((d) => Math.max(d.ventas, d.ingresos)), 1);
  const pathVentas = buildPath(data, 'ventas', width, height, maxValue);
  const pathIngresos = buildPath(data, 'ingresos', width, height, maxValue);
  const areaPath = `${pathVentas} L ${width} ${height} L 0 ${height} Z`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-100">
      <path d={areaPath} fill="rgba(32,132,255,0.25)" />
      <path d={pathVentas} stroke="rgba(32,132,255,0.8)" strokeWidth="4" fill="none" />
      <path d={pathIngresos} stroke="rgba(0,0,0,0.35)" strokeWidth="3" fill="none" strokeDasharray="6 6" />
    </svg>
  );
}

function LineChart({ data }) {
  const width = 320;
  const height = 160;
  const maxValue = Math.max(...data.map((d) => Math.max(d.ordenes, d.visitas)), 1);
  const pathOrdenes = buildPath(data, 'ordenes', width, height, maxValue);
  const pathVisitas = buildPath(data, 'visitas', width, height, maxValue);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-100">
      <path d={pathOrdenes} stroke="rgba(0,173,181,0.85)" strokeWidth="4" fill="none" />
      <path d={pathVisitas} stroke="rgba(158,158,158,0.7)" strokeWidth="3" fill="none" />
    </svg>
  );
}

function BarChart({ data }) {
  const height = 180;
  const maxValue = Math.max(...data.map((d) => Math.max(d.electronica, d.digitales)), 1);
  return (
    <div className="d-flex align-items-end justify-content-between" style={{ height }}>
      {data.map((d) => (
        <div key={d.mes} className="text-center" style={{ width: 36 }}>
          <div className="bg-success mb-1" style={{ height: `${(d.electronica / maxValue) * (height - 40)}px` }}></div>
          <div className="bg-secondary" style={{ height: `${(d.digitales / maxValue) * (height - 40)}px` }}></div>
          <small className="d-block mt-1 text-muted" style={{ fontSize: 10 }}>{d.mes}</small>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ data }) {
  const total = data.reduce((acc, d) => acc + d.valor, 0) || 1;
  let offset = 0;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="d-flex flex-column align-items-center">
      <svg viewBox="0 0 220 220" style={{ maxWidth: 240 }}>
        {data.map((d, idx) => {
          const dash = (d.valor / total) * circumference;
          const circle = (
            <circle
              key={d.label}
              cx="110"
              cy="110"
              r={radius}
              fill="transparent"
              stroke={d.color}
              strokeWidth="32"
              strokeDasharray={`${dash} ${circumference}`}
              strokeDashoffset={-offset}
            />
          );
          offset += dash;
          return circle;
        })}
        <circle cx="110" cy="110" r="58" fill="white" />
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

function AdminDashboard() {
  const { isAdmin } = React.useContext(AuthContext);

  const areaData = [
    { mes: 'Ene', ventas: 120, ingresos: 220 },
    { mes: 'Feb', ventas: 150, ingresos: 240 },
    { mes: 'Mar', ventas: 140, ingresos: 200 },
    { mes: 'Abr', ventas: 110, ingresos: 180 },
    { mes: 'May', ventas: 180, ingresos: 260 },
    { mes: 'Jun', ventas: 130, ingresos: 190 },
    { mes: 'Jul', ventas: 200, ingresos: 230 },
  ];

  const lineData = [
    { mes: 'Ene', ordenes: 60, visitas: 120 },
    { mes: 'Feb', ordenes: 80, visitas: 140 },
    { mes: 'Mar', ordenes: 70, visitas: 135 },
    { mes: 'Abr', ordenes: 50, visitas: 100 },
    { mes: 'May', ordenes: 120, visitas: 170 },
    { mes: 'Jun', ordenes: 75, visitas: 125 },
    { mes: 'Jul', ordenes: 140, visitas: 190 },
  ];

  const barData = [
    { mes: 'Ene', electronica: 70, digitales: 25 },
    { mes: 'Feb', electronica: 60, digitales: 45 },
    { mes: 'Mar', electronica: 80, digitales: 20 },
    { mes: 'Abr', electronica: 85, digitales: 55 },
    { mes: 'May', electronica: 90, digitales: 35 },
    { mes: 'Jun', electronica: 55, digitales: 30 },
    { mes: 'Jul', electronica: 92, digitales: 40 },
  ];

  const donutData = useMemo(() => {
    const totals = PRODUCTOS.reduce(
      (acc, p) => {
        const prefix = p.code.substring(0, 2);
        if (prefix === 'FR') acc.frutas += 1;
        else if (prefix === 'VR') acc.verduras += 1;
        else if (prefix === 'PO') acc.organicos += 1;
        else if (prefix === 'PL') acc.lacteos += 1;
        return acc;
      },
      { frutas: 0, verduras: 0, organicos: 0, lacteos: 0 }
    );
    return [
      { label: 'Frutas', valor: totals.frutas, color: '#0dcaf0' },
      { label: 'Verduras', valor: totals.verduras, color: '#20c997' },
      { label: 'Organicos', valor: totals.organicos, color: '#ffc107' },
      { label: 'Lacteos', valor: totals.lacteos, color: '#dc3545' },
    ].filter((d) => d.valor > 0);
  }, []);

  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-lg-3 col-xl-2 mb-4">
            <Sidebar />
          </div>
          <div className="col-12 col-lg-9 col-xl-10">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h1 className="h4 text-success fw-bold mb-0">Panel de administracion</h1>
              {!isAdmin && <span className="badge bg-warning text-dark">Solo admin</span>}
            </div>

            {isAdmin ? (
              <div className="row g-4">
                <div className="col-12 col-lg-6">
                  <Card title="Area chart" colorClass="bg-primary" legend="Ventas / Ingresos">
                    <AreaChart data={areaData} />
                  </Card>
                </div>
                <div className="col-12 col-lg-6">
                  <Card title="Line chart" colorClass="bg-info" legend="Ordenes / Visitas">
                    <LineChart data={lineData} />
                  </Card>
                </div>
                <div className="col-12 col-lg-6">
                  <Card title="Categorias" colorClass="bg-danger" legend="Participacion">
                    <DonutChart data={donutData} />
                  </Card>
                </div>
                  <div className="col-12 col-lg-6">
                    <Card title="Bar chart" colorClass="bg-success" legend="Electronica vs Digital">
                      <BarChart data={barData} />
                    </Card>
                  </div>
              </div>
            ) : (
              <div className="alert alert-danger">Debes ser administrador para ver esta seccion.</div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AdminDashboard;
