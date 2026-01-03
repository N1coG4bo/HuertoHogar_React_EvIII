// Página para ver y editar el perfil del usuario actual.
import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../main_layout';
import Footer from '../footer';
import { AuthContext } from '../../context/AuthContext';
import PageHeader from '../page_header';

// Obtiene iniciales a partir del nombre completo.
function getInitials(name = '') {
  const parts = name.split(' ').filter(Boolean);
  const [a = '', b = ''] = parts;
  return `${a[0] || ''}${b[0] || ''}`.toUpperCase();
}

function PerfilView() {
  // Contexto de usuario, listado y accion para actualizar perfil.
  const { user, users, updateProfile } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    rut: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Encuentra la version mas completa del usuario autenticado.
  const fullUser = useMemo(() => {
    if (!user) return null;
    return users.find((u) => u.email === user.email) || { ...user };
  }, [user, users]);

  // Precarga valores del formulario cuando hay datos.
  useEffect(() => {
    if (!fullUser) return;
    setForm({
      name: fullUser.name || '',
      rut: fullUser.rut || '',
      password: '',
    });
  }, [fullUser]);

  if (!user) {
    return (
      <>
        <MainLayout>
          <div className="my-4">
            <div className="alert alert-warning">Debes iniciar sesion para editar tu perfil.</div>
            <Link to="/login" className="btn btn-success">Ir a login</Link>
          </div>
        </MainLayout>
        <Footer />
      </>
    );
  }

  // Actualiza el campo editado en el formulario local.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Procesa el guardado con trim y feedback de exito/error.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        name: form.name.trim() || user.name,
        rut: form.rut.trim(),
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
      <MainLayout>
        <PageHeader
          titulo="Editar perfil"
          eyebrow={
            <button className="btn btn-link text-decoration-none px-0 text-white" type="button" onClick={() => navigate(-1)}>
              ← Volver
            </button>
          }
        />

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
                <p className="text-muted mb-3">{fullUser?.rut || 'RUT no registrado'}</p>
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
                  <strong>RUT:</strong>
                  <div>{fullUser?.rut || 'No registrado'}</div>
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
                <label className="form-label">RUT</label>
                <input
                  name="rut"
                  type="text"
                  className="form-control"
                  value={form.rut}
                  onChange={handleChange}
                  placeholder="12.345.678-9"
                />
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
      </MainLayout>
      <Footer />
    </>
  );
}

export default PerfilView;
