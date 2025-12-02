import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { AuthContext } from '../context/AuthContext';

function Registro() {
  const { register } = React.useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      register({ email: email.trim(), password, name: name.trim() || 'Usuario' });
      navigate('/productos');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container my-5" style={{ maxWidth: 480 }}>
        <h1 className="h3 text-success fw-bold mb-3">Crear cuenta</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
              minLength={6}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">Registrarse</button>
          <p className="mt-3 mb-0 text-center">
            Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
          </p>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default Registro;
