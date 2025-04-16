import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import repositoryMethods from '../repositories/usersRepository.js';
// import userDTO from '../DTOs/userDTO.js'; //todo: meter



async function register(user) {
    // Verificar si el usuario ya existe
    const existeUsuario = await repositoryMethods.findUserByEmail(user.email);
    if (existeUsuario) {
        throw new Error('El usuario ya existe');
    }
    // Encriptar contraseña
    user.password = await bcrypt.hash(user.password, 10);

    const usuario = await repositoryMethods.saveUser(new userDTO(user));
    // Generar token JWT
    const token = generarToken(usuario);
    return { token, usuario: { id: usuario.id, email: usuario.email, cargo: usuario.cargo } }
}

async function login(email, password) {
    try {
        const usuario = await repositoryMethods.findUserByEmail(email);
        if (!usuario) {
            throw new Error('Credenciales inválidas');
        }
        
        // Comparar la contraseña con la encriptada en la BD
        const esValida = await bcrypt.compare(password, usuario.password);
        if (!esValida) {
            throw new Error('Credenciales inválidas');
        }
        
    
        // Generar token JWT
        const token = generarToken(usuario);
        //const refreshToken = generarRefreshToken(usuario); 
        return { token, /*refreshToken,*/ usuario: { id: usuario.id, email: usuario.email, cargo: usuario.cargo } };
    } catch (error) {
        console.log(error); 
        throw new Error('Error fetching user: ' + error.message); 
    }
}

function generarToken(usuario) {
    return jwt.sign(
        { id: usuario.id, email: usuario.email, cargo: usuario.cargo },
        process.env.SECRET_KEY,
        { expiresIn: process.env.TOKEN_EXPIRATION * 1} 
        //Solo dios sabe pq necesita el *1, pero si se saca no funciona (asumo que tiene que ser con el singlethread de mierda de js)
    );
}

async function refreshToken(token) {
    try {
        const usuario = jwt.verify(token, process.env.SECRET_KEY);
        return this.generarToken(usuario);
    } catch (error) {
        throw new Error('Token inválido o expirado');  
    }
}

async function generarRefreshToken(usuario) { 
    const refreshToken = jwt.sign(
        { id: usuario.id},
        process.env.SECRET_KEY,
        { expiresIn: process.env.TOKEN_EXPIRATION * 720} 
    ); 
}


async function forgotPassword(email) {
    const usuario = await repositoryMethods.getUserByEmail(email);
    if (!usuario) {
      throw new Error('No existe una cuenta con este email');
    }

    // Generar un token aleatorio
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiration = new Date(Date.now() + 15 * 60 * 1000); // Expira en 15 minutos

    await authRepository.saveResetToken(email, resetToken, expiration); //!acomodar


    // Enviar email con el enlace
    const enlace = `https://miapp.com/reset-password?token=${resetToken}`;
    await emailService.enviarCorreo(email, 'Restablecer Contraseña', 
      `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${enlace}">${enlace}</a>`);

    return { message: 'Se ha enviado un correo con instrucciones para restablecer la contraseña' };
  }

async function resetPassword(token, nuevapassword) {
    const usuario = await repositoryMethods.getUserByResetToken(token);
    if (!usuario) {
      throw new Error('Token inválido o expirado');
    }

    // Encriptar nueva contraseña
    const hashedPassword = await bcrypt.hash(nuevapassword, 10);

    // Actualizar la contraseña y eliminar el token de recuperación

    
    //await authRepository.updatePassword(usuario.email, hashedPassword); //!mandar un dto
    await repositoryMethods.updatePassword(); //!acomodar

    return { message: 'Contraseña actualizada correctamente' };
  }


export default { 
    register, 
    login, 
    generarToken, 
    generarRefreshToken,
    refreshToken,
    forgotPassword, 
    resetPassword
}
