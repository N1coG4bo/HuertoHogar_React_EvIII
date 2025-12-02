// Sección hero de la página de inicio.
import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <header className="bg-success py-5 mb-5">
      <div className="container text-center">
        <div className="text-white">
          <h1 className="display-4 fw-bold">Frescura del campo a tu mesa</h1>
          <p className="lead mb-4">
            Productos locales, saludables y sustentables. Conecta con el origen de tus alimentos.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <Link to="/productos" className="btn btn-warning btn-lg text-brown">
              Explorar productos
            </Link>
            <Link to="/productos?view=destacados" className="btn btn-light btn-lg text-success">
              Conocenos
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Hero;
