import axios from 'axios';

window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;

// Initialize CSRF protection
axios.get('/sanctum/csrf-cookie').catch((err) => {
    console.error('Failed to initialize CSRF protection:', err);
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 419 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await axios.get('/sanctum/csrf-cookie');
        return axios(originalRequest);
      } catch (refreshError) {
        console.error('CSRF token refresh failed:', refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);