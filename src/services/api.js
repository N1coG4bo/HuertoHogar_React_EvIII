// Cliente axios centralizado para la app.
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '',
  timeout: 8000,
});

export default api;
