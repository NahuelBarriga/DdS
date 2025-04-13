import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extraer token del header, ignora el bearer

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado'});
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY); // Verificar y decodificar el token
    req.user = decoded; // Guardar datos del usuario autenticado en req.user
    next(); // Pasar al siguiente middleware o controlador
  } catch (err) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

export default authMiddleware;
// module.exports = authMiddleware;
