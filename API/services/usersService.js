// la user de inicializa cuando pasa de libre a ocupada y se libera cuadno vuelve a libre de ocupada. 
import bcrypt from 'bcryptjs';
import userDTO from '../DTOs/userDTO.js';
import repositoryMethods from "../repositories/usersRepository.js"; //metodos de comunicacion con la db

// Get all mesas
export const getAllUsers = async({cargo}) => {
    try {
        
        const users = await repositoryMethods.getAll({cargo});
        return users.map(user => new userDTO(user)); 
    } catch (error) {
        throw new Error('Error fetching users: ' + error.message); //todo: ver error 
    }
}

// Get a user by ID
async function getUserById(userId) {
    try {
        const user = await repositoryMethods.findUserById(userId);
        if (!user) {
            throw new Error('user not found'); //! corregir el error que lanza
        }
        return new userDTO(user);
    } catch (error) {
        throw new Error('Error fetching user: ' + error.message); //! corregir el error que lanza
    }
}


// Create a new user
async function createUser(user) { 
    try { 
        user.password = await bcrypt.hash(user.password, 10);
        const userNuevo = new userDTO(user);
        const response = await repositoryMethods.saveUser(userNuevo);
        return response;
    } catch (error) {
        throw new Error('Error creating user: ' + error.message); //! corregir el error que lanza
    }
}


// Update a user by ID
async function updateUser(userId, updateData) {
    try {
        const user = await repositoryMethods.findUserById(userId);
        if (!user) {
            throw new Error('user not found');
        }
        const cambioPass = await bcrypt.compare(updateData.password, user.password);
        if (!cambioPass) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }
        const userUpdate = new userDTO(updateData);
        return await repositoryMethods.updateUser(userId, userUpdate);
        
    } catch (error) {
        throw new Error('Error updating user: ' + error.message);
    }
}


// Delete a user by ID
async function deleteUser(userId) {
    try {
        repositoryMethods.deleteUser(userId); //si no devuelve nada hay exito, //todo: ver esto, pq si se rompe pq la db es lenta, no se borra y da codigo 200
    } catch (error) {
        throw new Error('Error deleting user: ' + error.message);
    }
}


export default {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    getAllUsers,
};