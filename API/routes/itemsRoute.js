import express from 'express';
import itemsMethods from '../controllers/itemController.js';
import validateQueryParams from '../middlewares/validateQueryParams.js';

const router = express.Router();

// Get /api/items - obtiene todos los items
router.get('/', validateQueryParams.validateItemQueryParams, itemsMethods.getAllItems);

// Get /api/menu - obtiene todos los items en formato menu
router.get('/menu',  itemsMethods.getMenu);

// GET /api/categorias - obtiene todas las categorias
router.get('/categorias', itemsMethods.getAllCategorias); //todo: si no va antes del get/id explota todo, solucionar

// PATCH /api/items/{id}/stock - actualiza el stock de un item by ID
router.patch('/:id/stock', itemsMethods.updateItemStock);

// Get /api/item/{id} - obtiene un item by ID
router.get('/:id', itemsMethods.getItemById);

// POST /api/item - Crea un nuevo item
router.post('/', itemsMethods.createItem);

// PUT /api/item/{id} - acutaliza un item by ID
router.patch('/:id', itemsMethods.updateItem); //es posible actualizar precio, nombre, descripcion, categoria

// DELETE api/item/{id} - eliminar un item by ID
router.delete('/:id', itemsMethods.deleteItem);


//! todo esto cambia si se implementa la categoria en la db

// POST /api/categoria - crea una nueva categoria 
router.post('/categorias', itemsMethods.createCategoria); 


// DELETE /api/categoria/{nombre} - elimina una categoria by nombre 
router.delete('/categorias/:id', itemsMethods.deleteCategoria);


export default router;