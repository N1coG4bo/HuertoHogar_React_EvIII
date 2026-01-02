// Test básico que valida que el hero se renderiza.
import { render, screen } from '@testing-library/react';
import App from './App';

test('muestra el hero en la pagina de inicio', () => {
  render(<App />);
  expect(screen.getByText(/Red Privada: e-commerce discreto/i)).toBeInTheDocument();
});
