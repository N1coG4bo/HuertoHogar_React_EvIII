import React from 'react';

function Footer() {
  return (
    <footer className="bg-white border-top py-4 mt-5">
      <div className="container text-center">
        <small className="text-muted">
          © {new Date().getFullYear()} HuertoHogar. Todos los derechos reservados.
        </small>
      </div>
    </footer>
  );
}

export default Footer;