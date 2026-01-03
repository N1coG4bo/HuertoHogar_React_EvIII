// Punto de entrada principal con las rutas de la app Red Privada.
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Inicio from './pages/inicio';
import ProductosPage from './pages/productos_page';
import ProductoDetalle from './pages/producto_detalle';
import Login from './pages/login';
import Registro from './pages/registro';
import RecuperarPassword from './pages/recuperar_password';
import Blog from './pages/blog';
import Carrito from './pages/carrito';
import Pedidos from './pages/pedidos';
import Comunidad from './pages/comunidad';
import Mensajes from './pages/mensajes';
import AdminUsuarios from './pages/admin_usuarios';
import AdminUsuarioDetalle from './pages/admin_usuario_detalle';
import AdminDashboard from './pages/admin_dashboard';
import RootDashboard from './pages/root_dashboard';
import Perfil from './pages/perfil';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductsProvider } from './context/ProductsContext';
import BackgroundParallax from './components/background_parallax';

function RequireAuth({ children }) {
  const { user } = React.useContext(AuthContext);
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

function PublicOnly({ children }) {
  const { user } = React.useContext(AuthContext);
  if (user) return <Navigate to="/productos" replace />;
  return children;
}

function AuthBackground() {
  const { user } = React.useContext(AuthContext);
  const location = useLocation();
  if (!user) return null;
  if (location.pathname === '/' || location.pathname === '/login') return null;
  return <BackgroundParallax />;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ProductsProvider>
          <Router>
            <AuthBackground />
            <Routes>
              <Route
                path="/"
                element={
                  <PublicOnly>
                    <Login />
                  </PublicOnly>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicOnly>
                    <Login />
                  </PublicOnly>
                }
              />
              <Route
                path="/registro"
                element={
                  <PublicOnly>
                    <Registro />
                  </PublicOnly>
                }
              />
              <Route
                path="/recuperar-password"
                element={
                  <PublicOnly>
                    <RecuperarPassword />
                  </PublicOnly>
                }
              />
              <Route
                path="/inicio"
                element={
                  <RequireAuth>
                    <Inicio />
                  </RequireAuth>
                }
              />
              <Route
                path="/productos"
                element={
                  <RequireAuth>
                    <ProductosPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/producto/:code"
                element={
                  <RequireAuth>
                    <ProductoDetalle />
                  </RequireAuth>
                }
              />
              <Route
                path="/blog"
                element={
                  <RequireAuth>
                    <Blog />
                  </RequireAuth>
                }
              />
              <Route
                path="/carrito"
                element={
                  <RequireAuth>
                    <Carrito />
                  </RequireAuth>
                }
              />
              <Route
                path="/pedidos"
                element={
                  <RequireAuth>
                    <Pedidos />
                  </RequireAuth>
                }
              />
              <Route
                path="/comunidad"
                element={
                  <RequireAuth>
                    <Comunidad />
                  </RequireAuth>
                }
              />
              <Route
                path="/mensajes"
                element={
                  <RequireAuth>
                    <Mensajes />
                  </RequireAuth>
                }
              />
              <Route
                path="/perfil"
                element={
                  <RequireAuth>
                    <Perfil />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <RequireAuth>
                    <AdminDashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/root/dashboard"
                element={
                  <RequireAuth>
                    <RootDashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin/usuarios"
                element={
                  <RequireAuth>
                    <AdminUsuarios />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin/usuarios/:email"
                element={
                  <RequireAuth>
                    <AdminUsuarioDetalle />
                  </RequireAuth>
                }
              />
              <Route
                path="*"
                element={
                  <RequireAuth>
                    <Navigate to="/productos" replace />
                  </RequireAuth>
                }
              />
            </Routes>
          </Router>
        </ProductsProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
