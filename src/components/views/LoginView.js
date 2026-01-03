// Formulario de inicio de sesión para usuarios registrados.
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Lightning from '../Lightning';

function LoginView() {
  // Estado local y acceso al metodo de login desde el contexto.
  const { login } = React.useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Mensaje de éxito si viene de recuperar contraseña
  const successMessage = location.state?.message;
  const redirectTo = location.state?.from?.pathname || '/productos';

  // Intenta autenticar y redirigir al catalogo; muestra error si falla.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-shell">
      <Lightning hue={120} xOffset={0} speed={1} intensity={1.1} size={1.1} />
      <div className="login-shell__content">
        <header className="login-hero">
          <h1 className="login-hero__title">Red Privada</h1>
          <p className="login-hero__subtitle">Acceso seguro a la red privada.</p>
        </header>
        <section className="login-card">
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-light">Correo</label>
              <input
                type="email"
                className="form-control form-control-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label text-light">Contrasena</label>
              <input
                type="password"
                className="form-control form-control-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3 text-end">
              <Link to="/recuperar-password" className="text-decoration-none small text-light">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <button type="submit" className="btn btn-success w-100 btn-lg">Entrar</button>
            <p className="mt-3 mb-0 text-center text-light">
              No tienes cuenta? <Link to="/registro">Crear cuenta</Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}

export default LoginView;
