import React from 'react';
// Recordatorio: En una implementación real con React Router, los <a> se reemplazarían por <Link to="...">

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        {/* Branding / Link a Home */}
        <a className="navbar-brand fw-bold text-success" href="/">
          🥑 HuertoHogar
        </a>

        {/* Botón menú responsive */}
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

        {/* Menú de navegación */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {/* Links principales de HuertoHogar */}
            <li className="nav-item">
              <a className="nav-link" href="/">Inicio</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/productos">Productos</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/nosotros">Nosotros</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/blog">Blog</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/contacto">Contacto</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/login">Iniciar sesión</a>
            </li>

            {/* Botones de Acción */}
            <li className="nav-item">
              <a className="btn btn-success ms-2" href="/registro">Registrarse</a>
            </li>
            <li className="nav-item">
              <a className="btn btn-outline-success ms-2" href="/carrito">
                🛒 Carrito
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;