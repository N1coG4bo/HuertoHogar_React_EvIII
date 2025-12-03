// Listado de usuarios para el panel de administración.
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../main_layout';
import Footer from '../footer';
import { AuthContext } from '../../context/AuthContext';

function getInitials(name = '') {
  const parts = name.split(' ').filter(Boolean);
  const [a = '', b = ''] = parts;
  return `${a[0] || ''}${b[0] || ''}`.toUpperCase();
}

function AdminUsuariosView() {
  const { users, isAdmin } = React.useContext(AuthContext);

  const cards = users.map((u) => ({
    ...u,
    title: u.role === 'admin' ? 'Administrador' : 'Cliente',
    about: u.about || (u.role === 'admin' ? 'Gestiona la plataforma' : 'Cliente HuertoHogar'),
    address: u.address || 'Direccion no registrada',
    phone: u.phone || '+56 9 0000 0000',
  }));

  return (
    <>
      <MainLayout>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="h4 text-success fw-bold mb-0">Usuarios</h1>
          {!isAdmin && <span className="badge bg-warning text-dark">Solo admin</span>}
        </div>

        {isAdmin ? (
          <div className="row g-4">
            {cards.map((u) => (
              <div className="col-12 col-md-6 col-xl-4" key={u.email}>
                <div className="card shadow-sm h-100">
                  <div className="card-body d-flex">
                    <div className="me-3 d-flex align-items-start">
                      <div
                        className="rounded-circle bg-light border d-flex align-items-center justify-content-center"
                        style={{ width: 72, height: 72, fontWeight: 'bold' }}
                      >
                        {getInitials(u.name || u.email)}
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <p className="text-muted mb-1">{u.title}</p>
                      <h5 className="mb-1">{u.name}</h5>
                      <p className="mb-1"><strong>About:</strong> {u.about}</p>
                      <p className="mb-1 text-muted" style={{ fontSize: '0.9rem' }}>
                        <i className="fas fa-map-marker-alt me-2 text-secondary" />
                        {u.address}
                      </p>
                      <p className="mb-2 text-muted" style={{ fontSize: '0.9rem' }}>
                        <i className="fas fa-phone-alt me-2 text-secondary" />
                        {u.phone}
                      </p>
                      <div className="d-flex gap-2">
                        <button className="btn btn-success btn-sm" type="button" disabled>
                          <i className="fas fa-comments me-1" /> Chat
                        </button>
                        <Link to={`/admin/usuarios/${encodeURIComponent(u.email)}`} className="btn btn-primary btn-sm">
                          <i className="fas fa-user me-1" /> Ver perfil
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-danger">Debes ser administrador para ver esta seccion.</div>
        )}
      </MainLayout>
      <Footer />
    </>
  );
}

export default AdminUsuariosView;
