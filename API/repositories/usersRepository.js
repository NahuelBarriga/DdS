import fs from 'fs';
import path from 'path';

import {prueba, dirDB} from '../config/devConfig.js'; 

import db from '../database/index.js';

const __dirname = dirDB;

const dbFilePath = path.resolve(__dirname + '/DBPrueba.json');

const readDB = () => {
    const data = fs.readFileSync(dbFilePath);
    return JSON.parse(data);
};


const writeDB = (data) => {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
};

const getAll = async ({ cargo }) => {
    if (prueba) {
        const db = readDB();
        console.log(db.users);
        return db.users
    } else {
       try {
            const whereClause = {};
            if (cargo) whereClause.cargo = cargo;
            return await User.findAll({ 
                where: whereClause,
                    order: [
                    ['id', 'ASC']
                    ],
                });
        } catch (error) {
            console.log(error); 
            throw new Error('Error fetching usuarios: ' + error.message);
        }
    }
};

const findUserById = async (userId) => { //empleado entran por aca, ver si es necesario algo asi para clientes
    if (prueba) {
        const db = await readDB();
        return db.users.find(user => user.id === userId);
    } else {
        try {
            return await db.User.findByPk(userId); //todo: ver como no compartir la contraseña
        } catch (error) {
            console.log(error); 
            throw new Error('Error fetching usuarios: ' + error.message);
        }
    }
};

const findUserByEmail = async (userEmail) => {
    if (prueba) {
        const db = await readDB();
        return db.users.find(user => user.email === userEmail);
    } else {
        console.log("Buscando usuario por email: ", userEmail);
        try {
            return await db.User.findOne({ where: { email: userEmail } });
        } catch (error) {
            console.log(error); 
            throw new Error('Error fetching usuarios: ' + error.message);
        }
    }
};

const saveUser = async (userData) => {
    if (prueba) {
        const db = await readDB();
        const newUser = { id: db.users.length + 1, ...userData };
        db.users.push(newUser);
        await writeDB(db);
        return newUser;
    } else {
        console.log("Creando usuario: ", userData);
        try {
            return await db.User.create(userData); 
        } catch (error) {
            console.log(error); 
            throw new Error('Error saving usuario: ' + error.message);
        }
    }
};

const deleteUser = async (userId) => {
    if (prueba) {
        const db = await readDB();
        const userIndex = db.users.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
            const deletedUser = db.users.splice(userIndex, 1);
            await writeDB(db);
            return deletedUser[0];
        }
        return null;
    } else {
        try {
            return await db.User.destroy({
                where: {
                    id:userId
                }
            });
        } catch (error) {
            console.log(error); 
            throw new Error('Error deleting usuario: ' + error.message);
        }
    }
};

const updateUser = async (userId, updateData) => {
    if (prueba) {
        const db = await readDB();
        const userIndex = db.users.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
            db.users[userIndex] = { ...db.users[userIndex], ...updateData };
            await writeDB(db);
            return db.users[userIndex];
        }
        return null;
    } else {
        try { 
            return await db.User.update(updateData, { 
                where : { id: userId } 
            });
        } catch (error) { 
            console.log(error); 
            throw new Error('Error updating usuario: ' + error.message);
        }
    }
};

const findUserByResetToken = async (token) => {
    if (prueba) {
        const db = await readDB();
        return db.users.find(user => user.reset_token === token && new Date(user.reset_token_expiration) > new Date());
    } else {
        //const query = `SELECT * FROM User WHERE reset_token = $1 AND reset_token_expiration > NOW()`;
        try {
            return await db.User.findOne({ where: { reset_token: token, reset_token_expiration: { [Op.gt]: new Date() } } });
        } catch (error) {
            console.log(error); 
            throw new Error('Error fetching usuarios: ' + error.message);
        }
    }
};

const findUserByToken = async(token) => { 
    try {
        return await db.User.findOne({ where: { reset_token: token, reset_token_expiration: { [Op.gt]: new Date() } } });
    } catch (error) {
        console.log(error); 
        throw new Error('Error fetching usuarios: ' + error.message);
    }
}

const updatePassword = async (userId, updateData) => {
    if (prueba) {
        const db = await readDB();
        const userIndex = db.users.findIndex(user => user.email === email);
        if (userIndex !== -1) {
            db.users[userIndex].contrasena = hashedPassword;
            db.users[userIndex].reset_token = null;
            db.users[userIndex].reset_token_expiration = null;
            await writeDB(db);
            return db.users[userIndex];
        }
        return null;
    } else {
        //const query = `UPDATE User SET contrasena = $1, reset_token = NULL, reset_token_expiration = NULL WHERE email = $2`;
        try { 
            return await db.User.update(updateData, { 
                where : { id: userId } 
            });
        } catch (error) { 
            console.log(error); 
            throw new Error('Error updating usuario: ' + error.message);
        }
    }
};

export default {
    findUserById,
    findUserByToken,
    getAll,
    saveUser,
    findUserByEmail,
    updateUser,
    findUserByResetToken,
    deleteUser,
    updatePassword
};