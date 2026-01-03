// Página de recuperación de contraseña con flujo paso a paso
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stepper, Step } from '../components/Stepper';
import { authService } from '../services/authService';
import DitherBackground from '../components/DitherBackground';

function RecuperarPassword() {
  const navigate = useNavigate();
  
  // Estados para cada paso
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estados de control
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');

  // Paso 1: Solicitar código de verificación
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.requestPasswordReset(email.trim());
      setResetToken(response.data.resetToken);
      // Avanzar automáticamente al siguiente paso
      const nextButton = document.querySelector('.stepper-container .btn-success');
      if (nextButton) nextButton.click();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al solicitar código de recuperación');
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Verificar código
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.verifyResetCode(email.trim(), verificationCode);
      // Avanzar automáticamente al siguiente paso
      const nextButton = document.querySelector('.stepper-container .btn-success');
      if (nextButton) nextButton.click();
    } catch (err) {
      setError(err.response?.data?.error || 'Código de verificación inválido');
    } finally {
      setLoading(false);
    }
  };

  // Paso 3: Establecer nueva contraseña
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await authService.confirmPasswordReset(email.trim(), verificationCode, newPassword);
      // Redirigir al login con mensaje de éxito
      navigate('/login', { state: { message: 'Contraseña actualizada exitosamente. Inicia sesión con tu nueva contraseña.' } });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalStep = () => {
    // Este callback se ejecuta cuando se hace clic en "Completar" en el último paso
    const form = document.getElementById('reset-password-form');
    if (form) {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  return (
    <div className="reset-shell">
      <DitherBackground />
      <div className="reset-shell__content">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <div className="card shadow-sm p-4">
          <Stepper
            initialStep={1}
            onFinalStepCompleted={handleFinalStep}
            backButtonText="Atrás"
            nextButtonText="Continuar"
            completeButtonText="Restablecer Contraseña"
            disableStepIndicators={true}
          >
                  {/* Paso 1: Ingresar Email */}
                  <Step title="Paso 1: Ingresa tu correo electrónico">
                    <form onSubmit={handleRequestCode}>
                      <p className="text-muted mb-3">
                        Ingresa el correo electrónico asociado a tu cuenta. Te enviaremos un código de verificación.
                      </p>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                          Correo Electrónico
                        </label>
                        <input
                          id="email"
                          type="email"
                          className="form-control"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="tu@correo.com"
                          disabled={loading || resetToken}
                        />
                      </div>
                      {!resetToken && (
                        <button
                          type="submit"
                          className="btn btn-success w-100"
                          disabled={loading || !email.trim()}
                        >
                          {loading ? 'Enviando...' : 'Enviar Código'}
                        </button>
                      )}
                      {resetToken && (
                        <div className="alert alert-success mt-3">
                          ✓ Código enviado a tu correo electrónico
                        </div>
                      )}
                    </form>
                  </Step>

                  {/* Paso 2: Verificar Código */}
                  <Step title="Paso 2: Verifica el código">
                    <form onSubmit={handleVerifyCode}>
                      <p className="text-muted mb-3">
                        Revisa tu correo electrónico e ingresa el código de 6 dígitos que te enviamos.
                      </p>
                      <div className="mb-3">
                        <label htmlFor="code" className="form-label">
                          Código de Verificación
                        </label>
                        <input
                          id="code"
                          type="text"
                          className="form-control text-center"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          required
                          placeholder="000000"
                          maxLength={6}
                          disabled={loading}
                          style={{ fontSize: '1.5rem', letterSpacing: '0.5rem' }}
                        />
                        <small className="text-muted">
                          El código expira en 15 minutos
                        </small>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-success w-100"
                        disabled={loading || verificationCode.length !== 6}
                      >
                        {loading ? 'Verificando...' : 'Verificar Código'}
                      </button>
                    </form>
                  </Step>

                  {/* Paso 3: Nueva Contraseña */}
                  <Step title="Paso 3: Establece tu nueva contraseña">
                    <form id="reset-password-form" onSubmit={handleResetPassword}>
                      <p className="text-muted mb-3">
                        Ingresa tu nueva contraseña. Debe tener al menos 6 caracteres.
                      </p>
                      <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">
                          Nueva Contraseña
                        </label>
                        <input
                          id="newPassword"
                          type="password"
                          className="form-control"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          minLength={6}
                          placeholder="Mínimo 6 caracteres"
                          disabled={loading}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">
                          Confirmar Contraseña
                        </label>
                        <input
                          id="confirmPassword"
                          type="password"
                          className="form-control"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={6}
                          placeholder="Repite tu contraseña"
                          disabled={loading}
                        />
                      </div>
                      {newPassword && confirmPassword && newPassword !== confirmPassword && (
                        <div className="alert alert-warning">
                          Las contraseñas no coinciden
                        </div>
                      )}
                    </form>
                  </Step>
          </Stepper>

          <div className="text-center mt-4">
            <button
              className="btn btn-link text-decoration-none text-light"
              onClick={() => navigate('/login')}
            >
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecuperarPassword;
