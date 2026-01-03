// Vista de mensajes e inbox.
import React, { useCallback, useEffect, useState } from 'react';
import MainLayout from '../main_layout';
import Footer from '../footer';
import { AuthContext } from '../../context/AuthContext';
import { messagesService } from '../../services/messagesService';
import PageHeader from '../page_header';

function MensajesView() {
  const { user } = React.useContext(AuthContext);
  const [inbox, setInbox] = useState([]);
  const [thread, setThread] = useState([]);
  const [activeEmail, setActiveEmail] = useState('');
  const [message, setMessage] = useState('');
  const [newTo, setNewTo] = useState('');
  const [error, setError] = useState('');

  const refreshInbox = useCallback(async () => {
    if (!user) return;
    setError('');
    try {
      const { data } = await messagesService.inbox();
      setInbox(data.messages || []);
    } catch (err) {
      setError(err?.response?.data?.error || 'No pudimos cargar el inbox.');
    }
  }, [user]);

  const refreshThread = async (email) => {
    if (!email) return;
    setError('');
    try {
      const { data } = await messagesService.thread(email);
      setThread(data.messages || []);
      setActiveEmail(email);
    } catch (err) {
      setError(err?.response?.data?.error || 'No pudimos cargar la conversacion.');
    }
  };

  useEffect(() => {
    if (!user) return;
    const unsubscribe = messagesService.listenInbox((nextInbox) => {
      setInbox(nextInbox);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user || !activeEmail) {
      setThread([]);
      return undefined;
    }
    const unsubscribe = messagesService.listenThread(activeEmail, (nextThread) => {
      setThread(nextThread);
    });
    return () => unsubscribe();
  }, [user, activeEmail]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!activeEmail) return;
    setError('');
    try {
      await messagesService.send({ receiverEmail: activeEmail, content: message.trim() });
      setMessage('');
      refreshThread(activeEmail);
      refreshInbox();
    } catch (err) {
      setError(err?.response?.data?.error || 'No pudimos enviar el mensaje.');
    }
  };

  const handleNewMessage = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await messagesService.send({ receiverEmail: newTo.trim(), content: message.trim() || 'Hola!' });
      setNewTo('');
      setMessage('');
      refreshInbox();
    } catch (err) {
      setError(err?.response?.data?.error || 'No pudimos enviar el mensaje.');
    }
  };

  if (!user) {
    return (
      <>
        <MainLayout>
          <PageHeader titulo="Mensajes" />
          <div className="my-4">
            <div className="alert alert-warning">Inicia sesion para ver tus mensajes.</div>
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
          titulo="Mensajes"
          actions={<button className="btn btn-outline-light btn-sm" onClick={refreshInbox}>Actualizar</button>}
        />
        <div className="my-4">

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="row g-3">
            <div className="col-12 col-lg-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">Inbox</h5>
                  {inbox.length === 0 ? (
                    <p className="text-muted">Sin mensajes.</p>
                  ) : (
                    inbox.map((item) => (
                      <button
                        key={item.id}
                        className={`btn w-100 text-start mb-2 ${activeEmail === item.senderEmail ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={() => setActiveEmail(item.senderEmail)}
                      >
                        <div className="fw-bold">{item.senderEmail}</div>
                        <small className="text-muted">{item.content}</small>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-8">
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">Conversacion</h5>
                  {activeEmail ? (
                    <>
                      <div className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: 360 }}>
                        {thread.length === 0 ? (
                          <p className="text-muted">Sin mensajes en esta conversacion.</p>
                        ) : (
                          thread.map((msg) => (
                            <div key={msg.id} className="mb-2">
                              <div className="fw-bold">{msg.senderEmail}</div>
                              <div>{msg.content}</div>
                            </div>
                          ))
                        )}
                      </div>
                      <form className="d-flex gap-2" onSubmit={handleSend}>
                        <input
                          className="form-control"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Escribe un mensaje..."
                        />
                        <button className="btn btn-success" type="submit">Enviar</button>
                      </form>
                    </>
                  ) : (
                    <form className="mt-2" onSubmit={handleNewMessage}>
                      <label className="form-label">Nuevo mensaje</label>
                      <input
                        className="form-control mb-2"
                        value={newTo}
                        onChange={(e) => setNewTo(e.target.value)}
                        placeholder="correo@ejemplo.com"
                        required
                      />
                      <textarea
                        className="form-control mb-2"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Mensaje"
                        rows="3"
                      />
                      <button className="btn btn-success" type="submit">Enviar</button>
                    </form>
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

export default MensajesView;
