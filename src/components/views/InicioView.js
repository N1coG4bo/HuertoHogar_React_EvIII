// Página de inicio con hero y destacados.
import React from 'react';
import MainLayout from '../main_layout';
import Hero from '../hero';
import ProductosDestacados from '../productos_destacados';
import Footer from '../footer';

function InicioView() {
  return (
    <>
      <MainLayout>
        <Hero />
        <ProductosDestacados />
      </MainLayout>
      <Footer />
    </>
  );
}

export default InicioView;
