// Formulario de inicio de sesión para usuarios registrados.
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const { login } = React.useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      login(email.trim(), password);
      navigate('/productos');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container my-5 main-content" style={{ maxWidth: 480 }}>
        <h1 className="h3 text-success fw-bold mb-3">Iniciar sesion</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contrasena</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">Entrar</button>
          <p className="mt-3 mb-0 text-center">
            No tienes cuenta? <Link to="/registro">Crear cuenta</Link>
          </p>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default Login;
