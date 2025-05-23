import express from 'express';
import pedidoMethods from '../controllers/pedidoController.js'; 
import validateQueryParams from '../middlewares/validateQueryParams.js';
import authMiddleware from '../middlewares/authMiddleware.js';


const router = express.Router();

// GET /api/pedidos - obtiene todos los pedidos 
router.get('/', validateQueryParams.validatePedidoQueryParams, pedidoMethods.getAllPedidos);

router.get('/user', authMiddleware, pedidoMethods.getPedidosByUserId); //obtiene todos los pedidos de un usuario segun su ID

router.post('/pagar/:pedidoId', pedidoMethods.pagarPedido); //paga un pedido segun su ID
router.post('/rechazar/:pedidoId', pedidoMethods.rechazarPedido); //rechaza un pedido segun su ID
router.post('/enviado/:pedidoId', pedidoMethods.enviarPedido); //confirma un pedido segun su ID

// GET /api/pedido/{id} - obtener un pedido especifico 
router.get('/:id', pedidoMethods.getPedidoById);


// PUT /api/pedido/{id} - actualiza un pedido segun ID
router.patch('/:id', pedidoMethods.updatePedido);

// DELETE /api/pedido/{id} - borra un pedido segun ID
router.delete('/:id', pedidoMethods.deletePedido);

// //PUT estado /api/pedido/{id}/estado 
// router.put('/:id/estado', pedidoMethods.updateEstadoPedido); //se usa para confirmar, rechazar o pagar el pedido 

// // PUT /api/pedido/{id}/coupon - agrega un cupón a un pedido
// router.put('/:id/coupon', pedidoMethods.addCouponToPedido); //todo: agregar en controller

// // PUT /api/pedido/{id}/items - agrega items a un pedido 
// router.put('/:id/items', pedidoMethods.addItemsToPedido);



export default router;