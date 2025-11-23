import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8080',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  maxRedirects: 0,
});

api.interceptors.request.use(
  (config) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    console.log('Verificando sessão:', { isAuthenticated, url: config.url });
    if (!isAuthenticated && !['/api/users/login', '/api/users/register'].includes(config.url || '')) {
      console.log('Sessão não encontrada, cancelando requisição');
      if (typeof window !== 'undefined') {
        window.location.href = '/auth';
        throw new axios.Cancel('Requisição cancelada: usuário não autenticado');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('Erro na requisição:', {
      status: error.response?.status,
      url: error.config?.url,
      headers: error.response?.headers,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export default api;