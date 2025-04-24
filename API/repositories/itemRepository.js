import fs from 'fs';
import path from 'path';
import Pool from 'pg'; // Assuming you are using pg for PostgreSQL
import db from '../database/index.js';
import {prueba, dirDB} from '../config/devConfig.js';

const __dirname = dirDB; 
const {Item} = db; 


const dbFilePath = path.resolve(__dirname + '/DBPrueba.json');

const readDB = () => {
    const data = fs.readFileSync(dbFilePath);
    return JSON.parse(data);
};

const writeDB = (data) => {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
};

const findItemsAll = async({estado, categoria, precioMax, precioMin, tag}) => {
    if (prueba) {
        const db = readDB();
        return db.items;
    } else {

       try {
         const whereClause = {};
         if (estado) whereClause.estado = estado;
         if (categoria) whereClause.categoria = categoria;
         if (precioMax) whereClause.precio = { ...whereClause.precio, [Op.lte]: precioMax };
         if (precioMin) whereClause.precio = { ...whereClause.precio, [Op.gte]: precioMin };
         if (tag) whereClause.tag = tag;
 
         let response = await db.Item.findAll({ 
             where: whereClause,
             order: [
                ['categoriaId', 'ASC'],
                ['id', 'ASC']
             ],
         });

         return response;
       } catch (error) {
        
       }
    }
};

const findItemById = async (itemId) => {
    if (prueba) {
        const db = readDB();
        return db.items.find(item => item.id == itemId);
    } else {
        return await db.Item.findByPk(itemId);
    }
};

const findItemByName = async (itemName) => {
    if (prueba) {
        const db = readDB();
        return db.items.find(item => item.nombre == itemName);
    } else {
        return await db.Item.findOne({ 
            where: {
                nombre: itemName
            }
        });
    }
};

const saveItem = async (itemData) => {
    if (prueba) {
        
        const db = readDB();
        const newItem = { id: db.items.length + 2, ...itemData };
        db.items.push(newItem);
        writeDB(db);
        return newItem;
    } else {
        return await db.Item.create(itemData);
    }
};

const updateItem = async (itemId, itemData) => {
    if (prueba) {
        const db = readDB();
        const itemIndex = db.items.findIndex(item => item.id == itemId);
        if (itemIndex === -1) return null;
        db.items[itemIndex] = { ...db.items[itemIndex], ...itemData };
        writeDB(db);
        return db.items[itemIndex];
    } else {
        try {
            return await db.Item.update(itemData, {
                where: {
                    id: itemId
                }
            });
        } catch (error) {
            console.log(error); 
            throw new Error('Error updating item: ' + error.message);
        }
    }
};

const deleteItem = async (itemId) => {
    if (prueba) {
        const db = readDB();

        const itemIndex = db.items.findIndex(item => item.id == itemId);
        console.log(itemIndex);
        if (itemIndex == -1) return null;
        console.log('hola2');
        const deletedItem = db.items.splice(itemIndex, 1)[0];
        writeDB(db);
        return deletedItem;
        
    } else {
        return await db.Item.destroy({
            where: {
                id: itemId
            }
        });
    }
};

export default {
    findItemsAll,
    findItemById,
    updateItem,
    findItemByName,
    saveItem,
    deleteItem
};