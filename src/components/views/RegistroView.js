// Formulario de registro de nuevos usuarios.
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Ballpit from '../Ballpit';

function RegistroView() {
  // Estado local del formulario y acceso al metodo register.
  const { register } = React.useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Crea el usuario y redirige al catalogo; muestra error si falla.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ email: email.trim(), password, name: name.trim() || 'Usuario' });
      navigate('/productos');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-shell">
      <div className="register-ballpit">
        <Ballpit count={200} gravity={0.7} friction={0.8} wallBounce={0.95} followCursor={true} />
      </div>
      <div className="register-shell__content">
        <header className="register-hero">
          <h1 className="register-hero__title">Crear cuenta</h1>
          <p className="register-hero__subtitle">Registro seguro para acceder al catalogo.</p>
        </header>
        <section className="register-card">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-light">Nombre</label>
              <input
                type="text"
                className="form-control form-control-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
                minLength={6}
                required
              />
            </div>
            <button type="submit" className="btn btn-success w-100 btn-lg">Registrarse</button>
            <p className="mt-3 mb-0 text-center text-light">
              Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}

export default RegistroView;
