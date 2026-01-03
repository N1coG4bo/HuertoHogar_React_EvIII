// Cliente axios centralizado para la app.
import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearTokens, clearStoredUser } from './authStorage';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;
    if (!response || !config) {
      return Promise.reject(error);
    }

    const shouldRefresh = [401, 403].includes(response.status);
    if (!shouldRefresh || config._retry) {
      return Promise.reject(error);
    }

    config._retry = true;
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken || !API_BASE_URL) {
        return Promise.reject(error);
      }
      const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
      const { accessToken, refreshToken: nextRefresh } = refreshResponse.data || {};
      if (!accessToken) {
        return Promise.reject(error);
      }
      setTokens({ accessToken, refreshToken: nextRefresh || refreshToken });
      config.headers.Authorization = `Bearer ${accessToken}`;
      return api(config);
    } catch (refreshError) {
      clearTokens();
      clearStoredUser();
      return Promise.reject(refreshError);
    }
  }
);

export default api;
