// Vista de detalle para un producto individual.
import React from 'react';
import MainLayout from '../main_layout';
import DetalleContenido from '../detalle_contenido';
import Footer from '../footer';

function ProductoDetalleView() {
  return (
    <>
      <MainLayout>
        <DetalleContenido />
      </MainLayout>
      <Footer />
    </>
  );
}

export default ProductoDetalleView;
