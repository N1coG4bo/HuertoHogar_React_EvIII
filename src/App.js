import logo from './logo.svg';
import './App.css';
import Inicio from './pages/inicio';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Inicio/>}></Route>
      </Routes>
    </Router>  
  );
}

export default App;
