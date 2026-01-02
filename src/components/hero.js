// Sección hero de la página de inicio.
import React from 'react';
import { Link } from 'react-router-dom';
import AsciiText from './ascii_text';

function Hero() {
  return (
    // Hero principal con mensaje y CTA hacia el catalogo.
    <header className="hero-gradient py-5 mb-5 position-relative overflow-hidden hero-ascii">
      <AsciiText
        className="hero-ascii-layer"
        text="RED PRIVADA"
        asciiFontSize={7}
        textFontSize={160}
        textColor="#fdf9f3"
        planeBaseHeight={9}
        enableWaves
      />
      <div className="container text-center">
        <div className="text-white">
          <h1 className="display-4 fw-bold">Red Privada: e-commerce discreto</h1>
          <p className="lead mb-4">
            Distribuimos productos de calidad con empaques neutros y envios confiables.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <Link to="/productos" className="btn btn-warning btn-lg text-brown">
              Ver catalogo
            </Link>
            <Link to="/productos?view=destacados" className="btn btn-light btn-lg text-success">
              Como funciona
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Hero;
