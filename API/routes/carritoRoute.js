import validateQueryParams  from  "../middlewares/validateQueryParams.js";
import carritoMethods  from "../controllers/carritoController.js";
import express from 'express'; 
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();  

//POST api/carrito - crea un nuevo
router.post('/', authMiddleware ,carritoMethods.createPedido);

//DELETE api/pedidos/{id} - elimina un pedido pendiente
router.delete('/pedidos/:id', authMiddleware, carritoMethods.cancelarPedidoPendiente); 

//GET api/carrito/pedidos/cliente/{id} - obtiene los pedidos pendientes para un usuario con determinado id
router.get('/pedidos/cliente/:id', authMiddleware, carritoMethods.getPedidosPendientes); 

//POST api/carrito/pago - dispara el pago de los pedidos pendientes
router.post('/pago', authMiddleware, carritoMethods.pagarPedido); 
//! ESTO NO ES NECESARIO PARA EL MVP






export default router;

