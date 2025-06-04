import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


const baseURL = 'http://127.0.0.1:8000/api/';

let accessToken = localStorage.getItem('accessToken');
let refreshToken = localStorage.getItem('refreshToken');

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
  },
});

// Interceptor requestów
axiosInstance.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      try {
        // dekodowanie tokena by odczytać czas wygaśnięcia
        const decoded = jwtDecode(accessToken);
        const exp = decoded.exp; // czas wygaśnięcia w sekundach UNIX
        const now = Math.floor(Date.now() / 1000); // aktualny czas w sekundach UNIX
        const timeLeft = exp - now;

        console.log(`Token ważny jeszcze przez: ${timeLeft} sekund`);

        if (timeLeft < 30) {
          console.log('Token wygasa lub już wygasł, odświeżam token...');
          accessToken = await refreshAccessToken();

          if (!accessToken) {
            throw new Error('Nie udało się odświeżyć tokena');
          }
        }

        config.headers.Authorization = `Bearer ${accessToken}`;
      } catch (error) {
        console.error('Błąd podczas dekodowania tokena lub odświeżania:', error);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Funkcja do odswiezenia tokena i zapisania go w local Storage
const refreshAccessToken = async () => {
  try {
    const response = await axios.post(`${baseURL}token/refresh/`, {
      refresh: localStorage.getItem('refreshToken'),
    });
    localStorage.setItem('accessToken', response.data.access);

    if (response.data.refresh) {
      localStorage.setItem('refreshToken', response.data.refresh);
    }

    //wypisanie nowych tokenow
    console.log('Nowy refresh token: ', localStorage.getItem('refreshToken'));
    console.log('Nowy access token: ', localStorage.getItem('accessToken'));

    return response.data.access;
  } catch (error) {
    console.error("Nie udało się odświeżyć tokena", error);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = "/login";
    return null;
  }
};

// Proba odswiezenie tokena jesli odpowiedz wynosi 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        axiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
