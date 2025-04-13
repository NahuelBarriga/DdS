import authService from '../services/authService.js';
import userService from '../services/usersService.js'


export const getUserByToken = async(req, res) => { 
  try {
    const user = await userService.getUserById(req.user.id); 
    res.status(200).json({user}); 
  } catch (error) {
    console.log(error)
    res.status(500).json({message: error.message}); 
  }
}

export const register = async (req, res) => {
  try {
    const { token, usuario } = await authService.register(req.body);
    console.log(usuario);
    res.status(201).json({ token, usuario });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { token, usuario, refreshToken } = await authService.login(req.body.email, req.body.password);
    // Guardar el Refresh Token en una httpOnly Cookie
    res.cookie("refreshToken", refreshToken, {
    httpOnly: true,  // No accesible desde JS
    secure: true,    // Solo en HTTPS (en producción)
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
  });
    res.status(200).json({ token, usuario });
  } catch (error) {
    res.status(401).json({ message:  'Credenciales inválidas' });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken; // Lee la cookie
    if (!refreshToken) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }
    const nuevoToken = await authService.refreshToken(refreshToken);
    res.json({ token: nuevoToken });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" }); //borra la cookie
  res.json({ message: 'Logout exitoso' });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await authService.forgotPassword(email);
    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, nuevaContrasena } = req.body;
    const response = await authService.resetPassword(token, nuevaContrasena);
    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const oauthCallback = (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: 'Error en la autenticación' });
  }

  // Enviar token JWT al cliente
  res.json({ token: req.user.token, usuario: req.user.usuario });
};

export default { 
  register, 
  login, 
  getUserByToken,
  refreshToken,
  logout, 
  forgotPassword,
  resetPassword,
  oauthCallback
}