// Página para ver y editar el perfil del usuario actual.
import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Sidebar from '../components/sidebar';
import { AuthContext } from '../context/AuthContext';

function getInitials(name = '') {
  const parts = name.split(' ').filter(Boolean);
  const [a = '', b = ''] = parts;
  return `${a[0] || ''}${b[0] || ''}`.toUpperCase();
}

function Perfil() {
  const { user, users, updateProfile } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    about: '',
    phone: '',
    address: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fullUser = useMemo(() => {
    if (!user) return null;
    return users.find((u) => u.email === user.email) || { ...user };
  }, [user, users]);

  useEffect(() => {
    if (!fullUser) return;
    setForm({
      name: fullUser.name || '',
      about: fullUser.about || '',
      phone: fullUser.phone || '',
      address: fullUser.address || '',
      password: '',
    });
  }, [fullUser]);

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="container my-5">
          <div className="alert alert-warning">Debes iniciar sesion para editar tu perfil.</div>
          <Link to="/login" className="btn btn-success">Ir a login</Link>
        </div>
        <Footer />
      </>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      updateProfile({
        name: form.name.trim() || user.name,
        about: form.about.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        password: form.password.trim() || undefined,
      });
      setMessage('Perfil actualizado');
      setError('');
      setForm((prev) => ({ ...prev, password: '' }));
      setTimeout(() => setMessage(''), 2500);
    } catch (err) {
      setError(err.message);
    }
  };

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
              <button className="btn btn-link text-decoration-none px-0" type="button" onClick={() => navigate(-1)}>
                ← Volver
              </button>
              <h1 className="h4 text-success fw-bold mb-0">Editar perfil</h1>
            </div>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row g-4">
              <div className="col-12 col-lg-5">
                <div className="card shadow-sm h-100">
                  <div className="card-body text-center">
                    <div
                      className="rounded-circle bg-light border d-inline-flex align-items-center justify-content-center mb-3"
                      style={{ width: 96, height: 96, fontWeight: 'bold', fontSize: 22 }}
                    >
                      {getInitials(fullUser?.name || fullUser?.email)}
                    </div>
                    <h5 className="mb-1">{fullUser?.name}</h5>
                    <p className="text-muted mb-3">{fullUser?.about || 'Completa tu bio'}</p>
                    <div className="d-grid gap-2">
                      <button className="btn btn-success" type="button" disabled>Seguir</button>
                      <button className="btn btn-outline-primary" type="button" disabled>Mensaje</button>
                    </div>
                  </div>
                  <div className="list-group list-group-flush">
                    <div className="list-group-item">
                      <strong>Correo:</strong>
                      <div>{fullUser?.email}</div>
                    </div>
                    <div className="list-group-item">
                      <strong>Telefono:</strong>
                      <div>{fullUser?.phone || 'No registrado'}</div>
                    </div>
                    <div className="list-group-item">
                      <strong>Direccion:</strong>
                      <div>{fullUser?.address || 'No registrada'}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-7">
                <form className="card p-4 shadow-sm h-100" onSubmit={handleSubmit}>
                  <h2 className="h5 mb-3">Actualizar datos</h2>
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      name="name"
                      type="text"
                      className="form-control"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Sobre ti</label>
                    <textarea
                      name="about"
                      className="form-control"
                      rows="3"
                      value={form.about}
                      onChange={handleChange}
                      placeholder="Bio corta"
                    />
                  </div>

                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label">Telefono</label>
                      <input
                        name="phone"
                        type="text"
                        className="form-control"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+56 9 ..."
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Direccion</label>
                      <input
                        name="address"
                        type="text"
                        className="form-control"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Ciudad, calle..."
                      />
                    </div>
                  </div>

                  <div className="mb-3 mt-3">
                    <label className="form-label">Cambiar contrasena (opcional)</label>
                    <input
                      name="password"
                      type="password"
                      className="form-control"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Dejar en blanco para mantener"
                    />
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <button type="submit" className="btn btn-success">Guardar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Perfil;
