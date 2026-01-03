// Sección hero de la página de inicio.
import React from 'react';
import { Link } from 'react-router-dom';
import Carousel from './Carousel';
import PixelBlastBackground from './PixelBlastBackground';

const ASSET_BASE = process.env.PUBLIC_URL || '';

const carouselItems = [
  {
    id: 1,
    title: 'Productos Orgánicos',
    description: 'Cultivos naturales sin químicos dañinos para tu salud y bienestar',
    image: `${ASSET_BASE}/servidor_seguro.png`,
    icon: (
      <img
        className="carousel-icon-image"
        src={`${ASSET_BASE}/servidor_seguro.png`}
        alt="Seguridad verificada"
      />
    ),
  },
  {
    id: 2,
    title: 'Envíos Discretos',
    description: 'Empaques neutros y entregas confiables directo a tu domicilio',
    image: `${ASSET_BASE}/prohibido_dinero.png`,
    icon: (
      <img
        className="carousel-icon-image"
        src={`${ASSET_BASE}/prohibido_dinero.png`}
        alt="Envíos discretos"
      />
    ),
  },
  {
    id: 3,
    title: 'Calidad Premium',
    description: 'Productos verificados y seleccionados de primera calidad',
    image: `${ASSET_BASE}/hacker.png`,
    icon: (
      <img className="carousel-icon-image" src={`${ASSET_BASE}/hacker.png`} alt="Calidad premium" />
    ),
  },
  {
    id: 4,
    title: 'Atención 24/7',
    description: 'Soporte y asesoría personalizada para todas tus consultas',
    image: `${ASSET_BASE}/identificacion.png`,
    icon: (
      <img
        className="carousel-icon-image"
        src={`${ASSET_BASE}/identificacion.png`}
        alt="Atención permanente"
      />
    ),
  },
  {
    id: 5,
    title: 'Pagos Seguros',
    description: 'Transacciones protegidas con métodos de pago confiables',
    image: `${ASSET_BASE}/escudo_candado.png`,
    icon: (
      <img
        className="carousel-icon-image"
        src={`${ASSET_BASE}/escudo_candado.png`}
        alt="Pagos seguros"
      />
    ),
  },
];

function Hero() {
  return (
    <header className="hero-gradient hero-blast py-5 mb-5 position-relative overflow-hidden">
      <PixelBlastBackground
        className="hero-blast-canvas"
        color="#7cf5a1"
        pixelSize={3}
        speed={0.7}
        edgeFade={0.6}
      />
      <div className="hero-blast-overlay" aria-hidden="true" />
      <div className="container hero-blast-content">
        <div className="row align-items-center">
          {/* Contenido del Hero */}
          <div className="col-lg-7 text-white mb-4 mb-lg-0">
            <h1 className="display-4 fw-bold mb-3">Red Privada</h1>
            <h2 className="h4 mb-4">E-commerce discreto y confiable</h2>
            <p className="lead mb-4">
              Distribuimos productos de calidad con empaques neutros y envíos confiables.
              Tu privacidad y satisfacción son nuestra prioridad.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/productos" className="btn btn-warning btn-lg text-brown px-4">
                <i className="fas fa-shopping-bag me-2"></i>
                Ver catálogo
              </Link>
              <Link to="/comunidad" className="btn btn-light btn-lg text-success px-4">
                <i className="fas fa-info-circle me-2"></i>
                Cómo funciona
              </Link>
            </div>
          </div>

          {/* Carrusel */}
          <div className="col-lg-5 d-flex justify-content-center">
            <Carousel
              items={carouselItems}
              baseWidth={380}
              autoplay={true}
              autoplayDelay={4000}
              pauseOnHover={true}
              loop={true}
              round={true}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Hero;
