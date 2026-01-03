// Listado de usuarios para el panel de administración.
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../main_layout';
import Footer from '../footer';
import ChromaGrid from '../ChromaGrid';
import PageHeader from '../page_header';
import { AuthContext } from '../../context/AuthContext';

// Obtiene iniciales para usar en el avatar circular.
function getInitials(name = '') {
  const parts = name.split(' ').filter(Boolean);
  const [a = '', b = ''] = parts;
  return `${a[0] || ''}${b[0] || ''}`.toUpperCase();
}

function AdminUsuariosView() {
  const { users, isAdmin } = React.useContext(AuthContext);

  // Transforma usuarios para ChromaGrid
  const chromaItems = users.map((u) => ({
    id: u.email,
    email: u.email,
    name: u.name || 'Sin nombre',
    username: u.email.split('@')[0],
    role: u.role === 'admin' ? 'Administrador' : u.role === 'root' ? 'Root' : 'Cliente',
    rut: u.rut || 'RUT no registrado',
    image: getInitials(u.name || u.email),
    actions: (
      <div className="d-flex gap-2 mt-2">
        <button className="btn btn-success btn-sm" type="button" disabled>
          <i className="fas fa-comments me-1" /> Chat
        </button>
        <Link 
          to={`/admin/usuarios/${encodeURIComponent(u.email)}`} 
          className="btn btn-primary btn-sm"
        >
          <i className="fas fa-user me-1" /> Ver perfil
        </Link>
      </div>
    ),
  }));

  return (
    <>
      <MainLayout>
        <PageHeader
          titulo="Usuarios del Sistema"
          actions={!isAdmin && <span className="badge bg-warning text-dark">Solo admin</span>}
        />

        {isAdmin ? (
          <ChromaGrid 
            items={chromaItems}
            radius={280}
            damping={0.4}
            fadeOut={0.5}
          />
        ) : (
          <div className="alert alert-danger">Debes ser administrador para ver esta seccion.</div>
        )}
      </MainLayout>
      <Footer />
    </>
  );
}

export default AdminUsuariosView;
