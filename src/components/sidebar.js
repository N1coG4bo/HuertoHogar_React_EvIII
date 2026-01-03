// Menú lateral con accesos directos a las secciones.
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import AnimatedList from './animated_list';

function classNames(...values) {
  return values.filter(Boolean).join(' ');
}

function Sidebar() {
  const { user, isAdmin, logout } = React.useContext(AuthContext);
  const { totalItems } = React.useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const view = params.get('view') || '';

  // Detecta la pagina activa para resaltar el item correspondiente.
  const page = React.useMemo(() => {
    if (location.pathname === '/') return 'inicio';
    if (location.pathname === '/blog') return 'blog';
    if (location.pathname.startsWith('/productos')) return 'catalogo';
    if (location.pathname.startsWith('/carrito')) return 'carrito';
    if (location.pathname.startsWith('/pedidos')) return 'pedidos';
    if (location.pathname.startsWith('/comunidad')) return 'comunidad';
    if (location.pathname.startsWith('/mensajes')) return 'mensajes';
    if (location.pathname.startsWith('/perfil')) return 'perfil';
    if (location.pathname.startsWith('/login')) return 'login';
    if (location.pathname.startsWith('/registro')) return 'registro';
    if (location.pathname.startsWith('/admin/dashboard')) return 'admin-dashboard';
    if (location.pathname.startsWith('/root/dashboard')) return 'root-dashboard';
    if (location.pathname.startsWith('/admin/usuarios')) return 'admin';
    return '';
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    {
      key: 'inicio',
      node: (
        <Link to="/" className={classNames('nav-link', page === 'inicio' && 'active')}>
          <i className="nav-icon fas fa-home"></i>
          <p>Inicio</p>
        </Link>
      ),
    },
    {
      key: 'catalogo',
      node: (
        <Link to="/productos" className={classNames('nav-link', page === 'catalogo' && !view && 'active')}>
          <i className="nav-icon fas fa-store"></i>
          <p>Catalogo</p>
        </Link>
      ),
    },
    {
      key: 'destacados',
      node: (
        <Link to="/productos?view=destacados" className={classNames('nav-link', view === 'destacados' && 'active')}>
          <i className="nav-icon fas fa-star"></i>
          <p>Destacados</p>
        </Link>
      ),
    },
    {
      key: 'ofertas',
      node: (
        <Link to="/productos?view=ofertas" className={classNames('nav-link', view === 'ofertas' && 'active')}>
          <i className="nav-icon fas fa-tags"></i>
          <p>Ofertas</p>
        </Link>
      ),
    },
    {
      key: 'blog',
      node: (
        <Link to="/blog" className={classNames('nav-link', page === 'blog' && 'active')}>
          <i className="nav-icon fas fa-newspaper"></i>
          <p>Blog</p>
        </Link>
      ),
    },
    {
      key: 'carrito',
      node: (
        <Link to="/carrito" className={classNames('nav-link', page === 'carrito' && 'active')}>
          <i className="nav-icon fas fa-shopping-cart"></i>
          <p>
            Carrito
            {totalItems > 0 && <span className="badge bg-success ms-2">{totalItems}</span>}
          </p>
        </Link>
      ),
    },
    {
      key: 'pedidos',
      node: (
        <Link to="/pedidos" className={classNames('nav-link', page === 'pedidos' && 'active')}>
          <i className="nav-icon fas fa-receipt"></i>
          <p>Pedidos</p>
        </Link>
      ),
    },
    {
      key: 'comunidad',
      node: (
        <Link to="/comunidad" className={classNames('nav-link', page === 'comunidad' && 'active')}>
          <i className="nav-icon fas fa-user-friends"></i>
          <p>Comunidad</p>
        </Link>
      ),
    },
    {
      key: 'mensajes',
      node: (
        <Link to="/mensajes" className={classNames('nav-link', page === 'mensajes' && 'active')}>
          <i className="nav-icon fas fa-envelope"></i>
          <p>Mensajes</p>
        </Link>
      ),
    },
  ];

  if (user) {
    navItems.push(
      {
        key: 'perfil',
        node: (
          <Link to="/perfil" className={classNames('nav-link', page === 'perfil' && 'active')}>
            <i className="nav-icon fas fa-user"></i>
            <p>Mi perfil</p>
          </Link>
        ),
      },
      {
        key: 'logout',
        node: (
          <button type="button" className="nav-link btn text-start w-100" onClick={handleLogout}>
            <i className="nav-icon fas fa-sign-out-alt"></i>
            <p>Salir</p>
          </button>
        ),
      }
    );
  } else {
    navItems.push(
      {
        key: 'login',
        node: (
          <Link to="/login" className={classNames('nav-link', page === 'login' && 'active')}>
            <i className="nav-icon fas fa-sign-in-alt"></i>
            <p>Iniciar sesion</p>
          </Link>
        ),
      },
      {
        key: 'registro',
        node: (
          <Link to="/registro" className={classNames('nav-link', page === 'registro' && 'active')}>
            <i className="nav-icon fas fa-user-plus"></i>
            <p>Registrate</p>
          </Link>
        ),
      }
    );
  }

  if (isAdmin) {
    if (user?.role === 'root') {
      navItems.push({
        key: 'root-dashboard',
        node: (
          <Link to="/root/dashboard" className={classNames('nav-link', page === 'root-dashboard' && 'active')}>
            <i className="nav-icon fas fa-crown"></i>
            <p>Root dashboard</p>
          </Link>
        ),
      });
    }
    navItems.push(
      {
        key: 'admin-dashboard',
        node: (
          <Link to="/admin/dashboard" className={classNames('nav-link', page === 'admin-dashboard' && 'active')}>
            <i className="nav-icon fas fa-chart-line"></i>
            <p>Admin dashboard</p>
          </Link>
        ),
      },
      {
        key: 'admin-users',
        node: (
          <Link to="/admin/usuarios" className={classNames('nav-link', page === 'admin' && 'active')}>
            <i className="nav-icon fas fa-users"></i>
            <p>Admin usuarios</p>
          </Link>
        ),
      }
    );
  }

  return (
    <aside className="app-sidebar shadow-sm" data-bs-theme="light">
      <div className="sidebar-brand">
        <Link to="/" className="brand-link d-flex align-items-center gap-2 text-decoration-none">
          <span
            className="brand-image rounded-circle bg-success d-inline-flex align-items-center justify-content-center text-white fw-bold"
            style={{ width: 32, height: 32 }}
          >
            HH
          </span>
          <span className="brand-text fw-light">Red Privada</span>
        </Link>
      </div>

      <div className="sidebar-wrapper">
        <nav className="mt-2">
          <AnimatedList
            items={navItems}
            className="nav sidebar-menu flex-column"
            data-lte-toggle="treeview"
            role="navigation"
            aria-label="Main navigation"
            data-accordion="false"
            id="navigation"
          />
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
