import axios from "axios";
import { API_PORT } from "../config";

const API_URL = `http://localhost:${API_PORT}/api`; // URL base de la API

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include" //para que mande la cookie
});

// Interceptor para agregar el token JWT en cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  
  console.log("Request URL:", config.url); //! borrar despues
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.response.status === 401) {
      try {
        const newToken = await refreshAccessToken(); //!ver esto
        if (newToken) {
          error.config.headers["Authorization"] = `Bearer ${newToken}`;
          return api.request(error.config);
        }
      } catch (refreshError) {
        localStorage.removeItem("token");
        window.location.href = "/";
        console.error("Error refreshing token:", refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
