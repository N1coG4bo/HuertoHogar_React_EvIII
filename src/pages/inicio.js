// Página de inicio con hero y destacados.
import React from 'react';
import Navbar from '../components/navbar';
import Hero from '../components/hero';
import ProductosDestacados from '../components/productos_destacados';
import Footer from '../components/footer';

function Inicio() {
  return (
    <div className="main-content">
      <Navbar />
      <Hero />
      <ProductosDestacados />
      <Footer />
    </div>
  );
}

export default Inicio;
