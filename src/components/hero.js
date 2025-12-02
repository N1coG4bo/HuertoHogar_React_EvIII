import React from 'react';

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
            <a href="/productos" className="btn btn-warning btn-lg text-brown">
              Explorar productos
            </a>
            <a href="/nosotros" className="btn btn-light btn-lg text-success">
              Conócenos
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Hero;