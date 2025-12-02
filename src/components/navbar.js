import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

function Navbar() {
  const { user, isAdmin, logout } = React.useContext(AuthContext);
  const { totalItems } = React.useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold text-success d-flex align-items-center gap-2" to="/">
          <span className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center" style={{ width: 28, height: 28, fontSize: 14 }}>
            HH
          </span>
          HuertoHogar
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>Inicio</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/productos">Productos</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/blog">Blog</NavLink>
            </li>
            {isAdmin && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/dashboard">Admin Dashboard</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/usuarios">Admin Usuarios</NavLink>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav ms-auto align-items-lg-center">
            {user ? (
              <>
                <li className="nav-item me-2">
                  <NavLink className="nav-link" to="/perfil">Hola, {user.name}</NavLink>
                </li>
                <li className="nav-item me-2">
                  <button className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>Salir</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">Iniciar sesion</NavLink>
                </li>
                <li className="nav-item ms-lg-2">
                  <NavLink className="btn btn-success" to="/registro">Registrarse</NavLink>
                </li>
              </>
            )}
            <li className="nav-item ms-lg-3">
              <NavLink className="btn btn-outline-success position-relative" to="/carrito">
                🛒 Carrito
                {totalItems > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {totalItems}
                  </span>
                )}
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
