import itemMethods from './itemRepository.js'; 
import fs from 'fs';
import path from 'path';
import Pool from 'pg'; // Assuming you are using pg for PostgreSQL
import db from '../database/index.js';
import {prueba, dirDB} from '../config/devConfig.js'; 

const __dirname = dirDB; 
const {Categoria} = db;


const dbFilePath = path.resolve(__dirname + '/DBPrueba.json');
const readDB = () => {
    const data = fs.readFileSync(dbFilePath);
    return JSON.parse(data);
};

const writeDB = (data) => {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
};


const getAllCategorias = async() => { 
    //SELECT * FROM Categoria 
    if (prueba) {
            const db = readDB();
            return db.categorias;
    } else {
        return await Categoria.findAll();
    }
    
}

const saveCategoria = async (categoriaData) => {
    //INSERT INTO Categoria VALUES categoriaData
    const query = `INSERT INTO Categoria (tag, fecha, monto) VALUES ($1, $2, $3) RETURNING *`; 
    const values = [movData.tag, movData.fecha, movData.monto];
    const result = await Pool.query(query, values);
    return result.rows[0];
}

const deleteCategoria = async (categoriaId) => {
     //DELETE FROM Categoria WHERE id = categoriaId
    try { 
        const items = itemMethods.findItemsAll({categoriaId}); //se fija que la categoria este vacia para evitar items sin categoria 
        if (!items) { 
            const query = `DELETE FROM Categoria WHERE id = $1 RETURNING *`;
            const values = [categoriaId];
            const result = await Pool.query(query, values);
            return result.rows[0];
        }
    } catch(error) { 
        throw new Error('Error deleting categoria: ' + error.message);
    }
   
}

export default {
    getAllCategorias,
    saveCategoria,
    deleteCategoria
}