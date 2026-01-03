// Vista basica de comunidad (amigos y solicitudes).
import React, { useCallback, useEffect, useState } from 'react';
import MainLayout from '../main_layout';
import Footer from '../footer';
import { AuthContext } from '../../context/AuthContext';
import { socialService } from '../../services/socialService';
import PageHeader from '../page_header';

function ComunidadView() {
  const { user } = React.useContext(AuthContext);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [friends, setFriends] = useState([]);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const refresh = useCallback(async () => {
    if (!user) return;
    setError('');
    try {
      const [inbox, outbox, list] = await Promise.all([
        socialService.incoming(),
        socialService.outgoing(),
        socialService.friends(),
      ]);
      setIncoming(inbox.data.requests || []);
      setOutgoing(outbox.data.requests || []);
      setFriends(list.data.friends || []);
    } catch (err) {
      setError(err?.response?.data?.error || 'No pudimos cargar la comunidad.');
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const unsubscribeIncoming = socialService.listenIncoming((nextIncoming) => {
      setIncoming(nextIncoming);
    });
    const unsubscribeOutgoing = socialService.listenOutgoing((nextOutgoing) => {
      setOutgoing(nextOutgoing);
    });
    const unsubscribeFriends = socialService.listenFriends((nextFriends) => {
      setFriends(nextFriends);
    });
    return () => {
      unsubscribeIncoming();
      unsubscribeOutgoing();
      unsubscribeFriends();
    };
  }, [user]);

  const handleSend = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await socialService.sendRequest({ receiverEmail: email.trim() });
      setMessage('Solicitud enviada');
      setEmail('');
      refresh();
    } catch (err) {
      setError(err?.response?.data?.error || 'No pudimos enviar la solicitud.');
    }
  };

  const handleDecision = async (id, action) => {
    setError('');
    try {
      if (action === 'accept') await socialService.accept(id);
      if (action === 'reject') await socialService.reject(id);
      refresh();
    } catch (err) {
      setError(err?.response?.data?.error || 'No pudimos actualizar la solicitud.');
    }
  };

  if (!user) {
    return (
      <>
        <MainLayout>
          <PageHeader titulo="Comunidad" />
          <div className="my-4">
            <div className="alert alert-warning">Inicia sesion para ver la comunidad.</div>
          </div>
        </MainLayout>
        <Footer />
      </>
    );
  }

  return (
    <>
      <MainLayout>
        <PageHeader
          titulo="Comunidad"
          actions={<button className="btn btn-outline-light btn-sm" onClick={refresh}>Actualizar</button>}
        />
        <div className="my-4">

          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}

          <form className="card p-3 mb-4 shadow-sm" onSubmit={handleSend}>
            <label className="form-label">Invitar por correo</label>
            <div className="input-group">
              <input
                type="email"
                className="form-control"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button className="btn btn-success" type="submit">Enviar</button>
            </div>
          </form>

          <div className="row g-3">
            <div className="col-12 col-lg-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">Solicitudes recibidas</h5>
                  {incoming.length === 0 ? (
                    <p className="text-muted">Sin solicitudes.</p>
                  ) : (
                    incoming.map((req) => (
                      <div key={req.id} className="d-flex justify-content-between align-items-center mb-2">
                        <span>{req.senderEmail}</span>
                        <div className="btn-group">
                          <button className="btn btn-sm btn-outline-success" onClick={() => handleDecision(req.id, 'accept')}>Aceptar</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDecision(req.id, 'reject')}>Rechazar</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">Solicitudes enviadas</h5>
                  {outgoing.length === 0 ? (
                    <p className="text-muted">Sin solicitudes.</p>
                  ) : (
                    outgoing.map((req) => (
                      <div key={req.id} className="d-flex justify-content-between align-items-center mb-2">
                        <span>{req.receiverEmail}</span>
                        <span className="badge bg-light text-secondary">{req.status || 'Pendiente'}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">Amigos</h5>
                  {friends.length === 0 ? (
                    <p className="text-muted">Sin amigos aun.</p>
                  ) : (
                    friends.map((friend) => (
                      <div key={friend.email} className="mb-2">
                        {friend.name || friend.email}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
      <Footer />
    </>
  );
}

export default ComunidadView;
