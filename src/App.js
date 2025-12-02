import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inicio from './pages/inicio';
import ProductosPage from './pages/productos_page';
import ProductoDetalle from './pages/producto_detalle';
import Login from './pages/login';
import Registro from './pages/registro';
import Blog from './pages/blog';
import Carrito from './pages/carrito';
import AdminUsuarios from './pages/admin_usuarios';
import AdminUsuarioDetalle from './pages/admin_usuario_detalle';
import AdminDashboard from './pages/admin_dashboard';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/productos" element={<ProductosPage />} />
            <Route path="/producto/:code" element={<ProductoDetalle />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/usuarios" element={<AdminUsuarios />} />
            <Route path="/admin/usuarios/:email" element={<AdminUsuarioDetalle />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
