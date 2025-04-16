import repositoryMethods from "../repositories/itemRepository.js"; //metodos de comunicacion con la db
import categoriaMethods from "../repositories/categoriaRepository.js"; //metodos de comunicacion con la db
import itemDTO from '../DTOs/itemDTO.js';
import categoriaDTO from "../DTOs/categoriaDTO.js";


//get all Items
export const getAllItems = async({estado, categoria, precioMax, precioMin, tag}) => {
    try { 
        const items = await repositoryMethods.findItemsAll({estado, categoria, precioMax, precioMin, tag});
        return items.map(item => new itemDTO(item));
    } catch (error) {
        throw new Error('Error fetching Items: ' + error.message); //todo: ver error 
    }

}

export const getMenu = async() => {

    try { 
        // const cacheKey = 'menu';
        
        // const cacheData = await redisClients.get(cacheKey);
        
        // if (cacheData) {
        //     return JSON.parse(cacheData); // Retorna el menu en cache
        // }
        
        const items = await repositoryMethods.findItemsAll({});
        // await redisClients.setEx(cacheKey, 3600 * 24, JSON.stringify(items)); 
        return items.map(item => new itemDTO(item));
    } catch (error) {
        throw new Error('Error fetching Items: ' + error.message); //todo: ver error 
    }
}

// Get a Item by ID
export const getItemById = async (ItemId) => {
    try {
        
        const item = await repositoryMethods.findItemById(ItemId);
        if (!item) {
            throw new Error('Item not found'); //! corregir el error que lanza
        }
        
        return new itemDTO(item);
    } catch (error) {
        throw new Error('Error fetching Item: ' + error.message); //! corregir el error que lanza
    }
}


// Create a new Item
export const createItem = async (itemData) => {
    try {
        const item = new itemDTO(itemData);
  
        // if (getAllCategorias().includes(newItem.categoria)) { //verifica que la categoria es una valida antes de crear el DTO
        //     console.log("valido");
            const newItem = await repositoryMethods.saveItem(item);
            //invalidateCache(); //! agregar cache
            return newItem;
        // } else { 
        //     throw new Error('Error creating item' + error.message); 
        // }
    } catch (error) {
        //throw new Error(500, 'Error creating Item: ' + error.message); //! corregir el error que lanza
        throw new Error(500, 'Error creating Item');
    }
}


// Update a Item by ID
export const updateItem = async(itemId, updateData) => {
    try {
        const item = await repositoryMethods.findItemById(itemId);
        if (!item) {
            throw new Error('Item not found');
        }
        const updatedItem = new itemDTO(updateData); 
        
        const itemActualizado = await repositoryMethods.updateItem(itemId, updatedItem);
        if (itemActualizado) { 
            getIO().emit("itemActualizado", {itemId});
        }
        return itemActualizado;
        //invalidateCache(); //!volver
    } catch (error) {
        throw new Error('Error updating Item: ' + error.message);
    }
}


// Delete a Item by ID
export const deleteItem = async (ItemId) => {
    try {
        console.log('hola');
        await repositoryMethods.deleteItem(ItemId);
        //invalidateCache(); //!volver
    } catch (error) {
        throw new Error('Error deleting Item: ' + error.message);
    }
}

export const updateStock = async (itemId) => {
    try {
        const item = await getItemById(itemId);
        if (!item) {
            res.writeHead(404, 'not found'); //si no existe
            return res.end(); 
        }
        item.stock = !item.stock;
        console.log(new itemDTO(item))
        //*esto esta asi para en un futuro agregar el sistema de gestion de stock 
        // if (stock == 0) { 
        //     item.estado = 'agotado'; 
        // } if (stock > 0) { 
        //     item.estado = 'disponible'; 
        // }else { 
        //     res.writeHead(400, 'bad request'); //estado invalido 
        //     return res.end(); 
        // }
        const itemActualizado = await updateItem(item.id, new itemDTO(item));
        console.log(itemActualizado); //!borrar
    } catch (error) {
        console.log(error); 
        throw new Error('Error updating Item: ' + error.message);
    }
}



export const getAllCategorias = async() => { 
    try {
        const categorias = await categoriaMethods.getAllCategorias();
        return categorias;
    } catch (error) {
        throw new Error('Error fetching categorias: ' + error.message);
    }
}

export const createCategoria = async(categoriaData) => {
    try {
        
        const categorias = getAllCategorias(); 
        if (categorias.some(categoria => categoria.nombre === categoriaData.nombre)) {
            throw new Error('Categoria already exists');
        }
        const categoria = new categoriaDTO(categoriaData);
        categoriaMethods.saveCategoria(categoria);
    } catch (error) {
        throw new Error('Error deleting categoria: ' + error.message);
    }
}


export const deleteCategoria = async(categoriaId) => {
    try {
        categoriaMethods.deleteCategoria(categoriaId);
        invalidateCache();
    } catch (error) {
        throw new Error('Error deleting categoria: ' + error.message);
    }
}

export const invalidateCache = async () => {
    await redisClients.del('menu');
    console.log('Cache del menu borrada');
  }

  export default {
    createItem,
    getItemById,
    updateItem,
    deleteItem,
    getAllItems,
    updateStock,
    getAllCategorias,
    getMenu,
    createCategoria, 
    deleteCategoria
};