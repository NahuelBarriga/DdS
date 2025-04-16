import { createContext, useContext, useState, useEffect } from "react";
import api from '../services/api';
import userDTO from "../models/userDTO";

const AuthContext = createContext();
const API_URL = `/auth`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Estado del usuario
  const [token, setToken] = useState(localStorage.getItem('token') || null); //usa el token del localstorage, si existe
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null);

  useEffect(() => { //imprimir el usuario
    console.log("El usuario ha cambiado:", user);
  }, [user]);
  


  useEffect(() => { //si hay token, obtengo los datos del usuario
    if (token) {
      api
        .get(`${API_URL}/me`/*, { headers: { Authorization: `Bearer ${token}` }}*/)
        .then((res) => {
          setUser(res.data.user);
        })
        // .catch(async (err) => {
        //   if (err.response && err.response.status === 401) {
        //     // El access token puede haber expirado, intentamos refrescarlo
        //     await refreshAccessToken();
        //     // Luego de refrescar, reintenta obtener el usuario
        //     try {
        //       const res = await api.get(`${API_URL}/me`, {
        //         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        //       });
        //       setUser(res.data.user);
        //     } catch (err2) {
        //       console.error('Error al reintentar obtener el usuario', err2);
        //       logout();
        //     }
        //   } else {
        //     console.error('Error al obtener el usuario:', err);
        //   }
        // }); 
        //esta cubierto con el interceptor //todo: si funciona bien el interceptor, sacar
    }
  }, [token]);

   // Función para refrescar el token usando el refreshToken
   const refreshAccessToken = async () => {
    if (!refreshToken) return;
    try {
      const res = await api.post(`${API_URL}/refresh`, { refreshToken });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      // Opcional: actualizar el refreshToken si el backend emite uno nuevo
      if (res.data.refreshToken) {
        setRefreshToken(res.data.refreshToken);
        // localStorage.setItem('refreshToken', res.data.refreshToken);
      }
    } catch (error) {
      console.error('Error al refrescar el token:', error);
      logout();
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post(`${API_URL}/login`, {email, password}); 
      setToken(res.data.token); 
      setRefreshToken(res.data.refreshToken);
      localStorage.setItem('token',res.data.token);
      // localStorage.setItem('refreshToken',res.data.refreshToken);
      setUser(res.data.user);
      return res.data; 
    } catch (error) {
      console.log(error); 
      throw error; 
    }
  };

  const signup = async (email, password, nombre, telefono, cumpleanos) => { 
    try {
      const usuario = new userDTO({email, password, nombre, telefono, cumpleanos});
      const res = await api.post(`${API_URL}/register`, usuario); 
      console.log("res.data",res.data.user); //!sacar
      setToken(res.data.token); 
      //setRefreshToken(res.data.refreshToken);
      localStorage.setItem('token',res.data.token);
      // localStorage.setItem('refreshToken',res.data.refreshToken);
      setUser(res.data.user);
      return res.data; 
    } catch (error) {
      console.log(error); 
      throw error; 
    }
  };

  const logout = async() => {
   try {
     const res = await api.post(`${API_URL}/logout`); 
     setUser(null);
     setToken(null);
     localStorage.removeItem("token");
     window.location.href = "/";
     // localStorage.removeItem("refreshToken");
   } catch (error) {
      console.log(error); 
      throw error; 
   }
  };

   // Función para login con Google: redirige al endpoint del backend que inicia el flujo con Passport.
    const googleLogin = () => {
      window.location.href = `${API_URL}/google`;
    };

  // // Cargar usuario desde localStorage al recargar la página
  // useEffect(() => {
  //   const usuarioGuardado = localStorage.getItem("usuario");
  //   if (usuarioGuardado) {
  //     setUsuario(JSON.parse(usuarioGuardado));
  //   }
  // }, []);


  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acceder al contexto en cualquier parte de la app
export const useAuth = () => useContext(AuthContext);
