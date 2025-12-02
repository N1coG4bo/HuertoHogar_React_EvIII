import React from 'react';
import Navbar from '../components/navbar';
import DetalleContenido from '../components/detalle_contenido';
import Footer from '../components/footer';

function ProductoDetalle() {
  return (
    <div>
      <Navbar />
      <DetalleContenido />
      <Footer />
    </div>
  );
}

export default ProductoDetalle;