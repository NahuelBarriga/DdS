import serviceMethods from '../services/pedidoService.js'
import { pedidoSchema } from "../validations/pedidoValidation.js";


export const getAllPedidos = async (req, res) => {
    try {
        const {estado, clienteId, mesaId, fechaInicio, fechaFin} = req.query; 
        const pedidos = await serviceMethods.getAllPedidos({estado, clienteId, mesaId, fechaInicio, fechaFin});    
        console.log(pedidos);
        res.json(pedidos);
    } catch (error) {
        res.writeHead(500, 'Server error'); //si fallo algo en el server
        return res.end();
    }
}

export const getPedidoById = async(req, res) => {
    try {
        const pedido = await serviceMethods.getPedidoById(req.params.id); 
        if (!pedido) {
            res.writeHead(400, 'bad request'); //faltan datos 
            return res.end(); 
        }
        res.json(pedido); 
    } catch (error) {
        res.writeHead(500, 'Server error'); //si fallo algo en el server
        return res.end();
    }
}

// export const createPedido = (req, res) => {
//     try {
//         const pedido = new PedidoDTO(req.body);
//         pedido.clienteId = req.user.id; 
//         if (validatePedido(pedido)) {
//             serviceMethods.createPedido(req.body); 
//             res.writeHead(201, 'created'); //ok
//             return res.end();
//         } else {
//             res.writeHead(400, 'bad request'); //faltan datos
//             return res.end();
//         }
        
//     } catch {
//         res.writeHead(500, 'Server error'); //si fallo algo en el server
//         return res.end();
//     }

// }

export const updatePedido = async(req, res) => { //todo: agregar verificaciones de los campos
    try {
        const { error, value } = pedidoSchema.validate(req.body, { abortEarly: false });
        
        if (error) {
            return res.status(400).json({ errores: error.details.map((err) => err.message) });
        } 
        const pedidoActualizado = await serviceMethods.updatePedido(req.params.id, pedidoUpdate); 
        if (!pedidoActualizado) {
            res.writeHead(404, 'Not found'); //si no existe
            return res.end(); 
        }
        res.writeHead(200, 'ok');  // ok
        return res.end(); 
    } catch {
        res.writeHead(500, 'Server error'); //si fallo algo en el server
        return res.end();
    }
}

export const updatePedidoState = async(req, res) => {
    try {
        const estado = req.body; 
        if (estado = 'aceptado') { 
            const pedidoActualizado = await serviceMethods.confirmarPedido(req.params.id); 
        } else if (estado = 'rechazado') { 
            const pedidoActualizado = await serviceMethods.rechazarPedido(req.params.id); 
        } else if (estado = 'pago') { 
            const pedidoActualizado = await serviceMethods.registrarPagoPedido(req.params.id);  //este es por si paga en efectivo o posnet asi se registra desde empleado
        } else { 
            res.writeHead(400, 'bad request'); //estado invalido 
            return res.end(); 
        }
        if (!pedidoActualizado) {
            res.writeHead(404, 'not found'); //si no existe
            return res.end(); 
        }
        res.writeHead(200, 'ok');  
        return res.end(); 
    } catch {
        res.writeHead(500, 'server error'); //si fallo algo en el server
        return res.end();
    }

}

export const deletePedido = async(req, res) => { 
    try {
        const pedidoEliminado = await serviceMethods.deletePedido(req.params.id); 
        res.writeHead(200, 'ok'); //ok 
        return res.end(); 
    } catch (error){
        console.log(error); 
        res.writeHead(500, 'server error'); //si fallo algo en el server
        return res.end();
    }
}

export const getPedidosByUserId = async(req, res) => {
    try {
        const pedidos = await serviceMethods.getPedidosByUserId(req.user.id); 
        if (!pedidos) {
            res.writeHead(400, 'bad request'); //faltan datos 
            return res.end(); 
        }
        res.json(pedidos); 
    } catch (error) {
        res.writeHead(500, 'Server error'); //si fallo algo en el server
        return res.end();
    }
}

export const pagarPedido = async(req, res) => {
    try {
        const pedido = await serviceMethods.pagarPedido(req.params.pedidoId, req.body); 
        if (!pedido) {
            res.writeHead(400, 'bad request'); //faltan datos 
            return res.end(); 
        }
        res.json(pedido); 
    } catch (error) {
        console.log("Error paying pedido", error);
        res.writeHead(500, 'Server error'); //si fallo algo en el server
        return res.end();
    }
}

export const rechazarPedido = async(req, res) => {
    try {
        const pedido = await serviceMethods.rechazarPedido(req.params.pedidoId); 
        if (!pedido) {
            res.writeHead(400, 'bad request'); //faltan datos 
            return res.end(); 
        }
        res.json(pedido); 
    } catch (error) {
        res.writeHead(500, 'Server error'); //si fallo algo en el server
        return res.end();
    }
}

export const enviarPedido = async(req, res) => {
    try {
        const pedido = await serviceMethods.enviarPedido(req.params.pedidoId); 
        if (!pedido) {
            res.writeHead(400, 'bad request'); //faltan datos 
            return res.end(); 
        }
        res.json(pedido); 
    } catch (error) {
        res.writeHead(500, 'Server error'); //si fallo algo en el server
        return res.end();
    }
}




export default {
    getPedidoById,
    getAllPedidos,
    updatePedido,
    deletePedido, 
    updatePedidoState,
    getPedidosByUserId,
    pagarPedido,
    rechazarPedido,
    enviarPedido
};