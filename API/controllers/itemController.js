import ItemFormDTO from '../DTOs/itemFormDTO.js';
import serviceMethods from '../services/itemService.js';
import { itemSchema } from '../validations/itemValidation.js';



//todo se puede incorporar la verificacion de si tiene filtro, hay que ver como viaja
export const getAllItems = (req, res) => {
    try { 
        const {estado, categoria, precioMax, precioMin, tag} = req.query; 
        const item = serviceMethods.getAllItems({estado, categoria, precioMax, precioMin, tag}); 
        
        res.json(item);
    } catch { 
        res.writeHead(500, 'server error'); 
        return res.end(); 
    }
} 

export const getMenu = async (req, res) => {
    try { 
        const item = await serviceMethods.getMenu(); 
        // res.writeHead(200, 'ok'); 
        res.json(item);
    } catch { 
        
        res.writeHead(500, 'server error'); 
        return res.end(); 
    }
}

export const getItemById = async (req, res) => {
    try { 
        const item = await serviceMethods.getItemById(req.params.id); 
        if (!item) {
            res.writeHead(400, 'bad request'); //faltan datos 
            return res.end(); 
        }
        res.json(item); 
    } catch { 
        res.writeHead(500, 'server error');
        return res.end(); 
    }
}

export const createItem = async (req, res) => { 
    try {

        const { error, value } = itemSchema.validate(req.body, { abortEarly: false });
        if (error) {
            console.log(error);
            return res.status(400).json({ errores: error.details.map((err) => err.message) });
        }

        const nuevoItem = await serviceMethods.createItem(req.body); 
        res.writeHead(201, 'created'); //ok
        return res.end();
        
    } catch {
        res.writeHead(500, 'Server error'); //si fallo algo en el server
        return res.end();
    }
}

export const updateItem = async (req, res) => { 
    try {
        const { error, value } = itemSchema.validate(req.body, { abortEarly: false });
        if (error) {
        return res.status(400).json({ errores: error.details.map((err) => err.message) });
        }
        console.log(req.params.id);
        const ItemActualizado = await serviceMethods.updateItem(req.params.id, req.body); 
        
        res.writeHead(200, 'ok');  // ok
        return res.end(); 
        
    } catch {
        res.writeHead(500, 'Server error'); //si fallo algo en el server
        return res.end();
    }
}


export const deleteItem = async (req, res) => { 
    try {
        const ItemEliminado = await serviceMethods.deleteItem(req.params.id); 
    
        res.writeHead(200, 'ok'); //ok 
        return res.end(); 
    } catch {
        res.writeHead(500, 'server error'); //si fallo algo en el server
        return res.end();
    }
}

export const getAllCategorias = async (req, res) => { 
    try {
        const categorias = await serviceMethods.getAllCategorias(); 
        res.json(categorias);
    } catch {
        res.writeHead(500, 'server error'); //si fallo algo en el server
        return res.end();
    }
}

export const createCategoria = async (req, res) => { 
    try {
                
        await serviceMethods.createCategoria(req.body); 
        res.writeHead(201, 'created'); //ok
        return res.end();
    } catch {
        res.writeHead(500, 'server error'); //si fallo algo en el server
        return res.end();
    }
}

export const deleteCategoria = async (req, res) => { 
    try {
        const categoriaEliminada = await serviceMethods.deleteCategoria(req.params.id); 
        if (!categoriaEliminada) {
            res.writeHead(404, 'Not found'); //categoria no encontrado
            return res.end(); 
        } 
        res.writeHead(200, 'ok'); //ok
        return res.end(); 
    } catch {
        res.writeHead(500, 'server error'); //si fallo algo en el server
        return res.end();
    }
}

export const updateItemStock = async (req, res) => { 
    try{ 
        const item = await serviceMethods.updateStock(req.params.id, req.body.stock); 
        res.writeHead(200, 'ok'); 
        return res.end(); 
    } catch (error) { 
        res.writeHead(500, 'server error'); 
        return res.end(); 
    }
}

export default {
    createItem,
    getMenu,
    getItemById,
    getAllItems,
    updateItem,
    deleteItem,
    getAllCategorias,
    createCategoria,
    deleteCategoria,
    updateItemStock
};