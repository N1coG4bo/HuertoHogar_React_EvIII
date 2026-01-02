// Vista de catálogo con filtros y sidebar.
import React from 'react';
import MainLayout from '../main_layout';
import PageHeader from '../page_header';
import Catalogo from '../catalogo';
import Footer from '../footer';

function ProductosPageView() {
  return (
    <>
      <MainLayout>
        <PageHeader
          titulo="Catalogo de productos"
          bajada="Seleccion premium con distribucion discreta y envio seguro."
        />
        <Catalogo />
      </MainLayout>
      <Footer />
    </>
  );
}

export default ProductosPageView;
