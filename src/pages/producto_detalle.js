// Vista de detalle para un producto individual.
import React from 'react';
import Navbar from '../components/navbar';
import DetalleContenido from '../components/detalle_contenido';
import Footer from '../components/footer';

function ProductoDetalle() {
  return (
    <div className="main-content">
      <Navbar />
      <DetalleContenido />
      <Footer />
    </div>
  );
}

export default ProductoDetalle;
