// Perfil detallado de un usuario dentro del panel admin.
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Sidebar from '../components/sidebar';
import { AuthContext } from '../context/AuthContext';

function getInitials(name = '') {
  const parts = name.split(' ').filter(Boolean);
  const [a = '', b = ''] = parts;
  return `${a[0] || ''}${b[0] || ''}`.toUpperCase();
}

function AdminUsuarioDetalle() {
  const { email } = useParams();
  const navigate = useNavigate();
  const { users, isAdmin, user: currentUser } = React.useContext(AuthContext);

  const user = users.find((u) => u.email === email);

  if (!isAdmin) {
    return (
      <>
        <Navbar />
        <div className="container my-5">
          <div className="alert alert-danger">Debes ser administrador para ver esta seccion.</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="container my-5">
          <div className="alert alert-warning">Usuario no encontrado.</div>
          <Link to="/admin/usuarios" className="btn btn-outline-success mt-2">Volver</Link>
        </div>
        <Footer />
      </>
    );
  }

  const about = user.about || (user.role === 'admin' ? 'Gestiona la plataforma' : 'Cliente HuertoHogar');
  const address = user.address || 'Direccion no registrada';
  const phone = user.phone || '+56 9 0000 0000';

  return (
    <>
      <Navbar />
      <div className="container-fluid main-content">
        <div className="row">
          <div className="col-12 col-lg-3 col-xl-2 mb-4">
            <Sidebar />
          </div>
          <div className="col-12 col-lg-9 col-xl-10">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <Link to="/admin/usuarios" className="btn btn-link text-decoration-none px-0">
                  ← Volver
                </Link>
                <h1 className="h4 text-success fw-bold mb-0">Perfil de usuario</h1>
              </div>
              <div className="d-flex align-items-center gap-2">
                {currentUser?.email === user.email && (
                  <Link to="/perfil" className="btn btn-outline-primary btn-sm">Editar mi perfil</Link>
                )}
                <span className="badge bg-light text-secondary text-uppercase">{user.role}</span>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-12 col-lg-4">
                <div className="card shadow-sm">
                  <div className="card-body text-center">
                    <div
                      className="rounded-circle bg-light border d-inline-flex align-items-center justify-content-center mb-3"
                      style={{ width: 96, height: 96, fontWeight: 'bold', fontSize: 22 }}
                    >
                      {getInitials(user.name || user.email)}
                    </div>
                    <h5 className="mb-1">{user.name}</h5>
                    <p className="text-muted mb-3">{about}</p>
                    <div className="d-grid gap-2">
                      <button className="btn btn-success" type="button" disabled>Seguir</button>
                      <button className="btn btn-outline-primary" type="button" disabled>Mensaje</button>
                    </div>
                  </div>
                  <div className="list-group list-group-flush">
                    <div className="list-group-item">
                      <strong>Correo:</strong>
                      <div>{user.email}</div>
                    </div>
                    <div className="list-group-item">
                      <strong>Telefono:</strong>
                      <div>{phone}</div>
                    </div>
                    <div className="list-group-item">
                      <strong>Direccion:</strong>
                      <div>{address}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-8">
                <div className="card shadow-sm mb-3">
                  <div className="card-header bg-white">
                    <ul className="nav nav-tabs card-header-tabs">
                      <li className="nav-item">
                        <button className="nav-link active" type="button">Actividad</button>
                      </li>
                      <li className="nav-item">
                        <button className="nav-link" type="button" disabled>Timeline</button>
                      </li>
                      <li className="nav-item">
                        <button className="nav-link" type="button" disabled>Settings</button>
                      </li>
                    </ul>
                  </div>
                  <div className="card-body">
                    <p className="text-muted">Sin actividad registrada.</p>
                  </div>
                </div>

                <div className="card shadow-sm">
                  <div className="card-header bg-white">
                    <h5 className="mb-0">About me</h5>
                  </div>
                  <div className="card-body">
                    <p className="mb-2"><strong>Rol:</strong> {user.role}</p>
                    <p className="mb-2"><strong>Bio:</strong> {about}</p>
                    <p className="mb-0 text-muted">Puedes completar mas campos en el futuro.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AdminUsuarioDetalle;
