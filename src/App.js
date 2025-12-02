import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Inicio from './pages/inicio'; // Asumo que este ya lo tienes creado o es un placeholder
import ProductosPage from './pages/productos_page';
import ProductoDetalle from './pages/producto_detalle';

function App() {
  return (
    <Router>
      <Routes>
        {/* Página de Inicio */}
        <Route path='/' element={<Inicio />} />

        {/* Catálogo de Productos */}
        <Route path='/productos' element={<ProductosPage />} />

        {/* Detalle de Producto (Ruta Dinámica) */}
        {/* ":code" capturará valores como FR001, VR002, etc. */}
        <Route path='/producto/:code' element={<ProductoDetalle />} />
      </Routes>
    </Router> 
  );
}

export default App;