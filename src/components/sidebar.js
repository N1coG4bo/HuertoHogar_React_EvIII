import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

function classNames(...values) {
  return values.filter(Boolean).join(' ');
}

function Sidebar() {
  const { isAdmin } = React.useContext(AuthContext);
  const { totalItems } = React.useContext(CartContext);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const view = params.get('view') || '';

  const page = React.useMemo(() => {
    if (location.pathname === '/') return 'inicio';
    if (location.pathname === '/blog') return 'blog';
    if (location.pathname.startsWith('/productos')) return 'catalogo';
    if (location.pathname.startsWith('/carrito')) return 'carrito';
    if (location.pathname.startsWith('/admin/dashboard')) return 'admin-dashboard';
    if (location.pathname.startsWith('/admin/usuarios')) return 'admin';
    return '';
  }, [location.pathname]);

  return (
    <aside className="app-sidebar bg-body-secondary shadow" data-bs-theme="dark">
      <div className="sidebar-brand">
        <Link to="/" className="brand-link d-flex align-items-center gap-2 text-decoration-none">
          <span
            className="brand-image rounded-circle bg-success d-inline-flex align-items-center justify-content-center text-white fw-bold"
            style={{ width: 32, height: 32 }}
          >
            HH
          </span>
          <span className="brand-text fw-light">HuertoHogar</span>
        </Link>
      </div>

      <div className="sidebar-wrapper">
        <nav className="mt-2">
          <ul
            className="nav sidebar-menu flex-column"
            data-lte-toggle="treeview"
            role="navigation"
            aria-label="Main navigation"
            data-accordion="false"
            id="navigation"
          >
            <li className="nav-item">
              <Link to="/" className={classNames('nav-link', page === 'inicio' && 'active')}>
                <i className="nav-icon fas fa-home"></i>
                <p>Inicio</p>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/productos" className={classNames('nav-link', page === 'catalogo' && !view && 'active')}>
                <i className="nav-icon fas fa-store"></i>
                <p>Catalogo</p>
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/productos?view=destacados"
                className={classNames('nav-link', view === 'destacados' && 'active')}
              >
                <i className="nav-icon fas fa-star"></i>
                <p>Destacados</p>
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/productos?view=ofertas"
                className={classNames('nav-link', view === 'ofertas' && 'active')}
              >
                <i className="nav-icon fas fa-tags"></i>
                <p>Ofertas</p>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/blog" className={classNames('nav-link', page === 'blog' && 'active')}>
                <i className="nav-icon fas fa-newspaper"></i>
                <p>Blog</p>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/carrito" className={classNames('nav-link', page === 'carrito' && 'active')}>
                <i className="nav-icon fas fa-shopping-cart"></i>
                <p>
                  Carrito
                  {totalItems > 0 && <span className="badge bg-success ms-2">{totalItems}</span>}
                </p>
              </Link>
            </li>

            {isAdmin && (
              <>
                <li className="nav-item">
                  <Link
                    to="/admin/dashboard"
                    className={classNames('nav-link', page === 'admin-dashboard' && 'active')}
                  >
                    <i className="nav-icon fas fa-chart-line"></i>
                    <p>Admin dashboard</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/admin/usuarios"
                    className={classNames('nav-link', page === 'admin' && 'active')}
                  >
                    <i className="nav-icon fas fa-users"></i>
                    <p>Admin usuarios</p>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
