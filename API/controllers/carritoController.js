
import serviceMethods from '../services/carritoService.js';


export const createPedido = async (req, res) => { 
    try {
        req.body.clienteId = req.user.id; 
        const newPedido = await serviceMethods.createPedido(req.body); 
        res.writeHead(201, 'ok'); 
        return res.end(JSON.stringify(newPedido)); 
    } catch (error) {
        console.log(error);
        res.writeHead(500, 'server error'); //si fallo algo en el server
        return res.end();
    }
}

export const cancelarPedidoPendiente = async(req, res) => { 
    try {
        const pedidoEliminado = await serviceMethods.cancelarPedidoPendiente(req.params.id); 
        res.writeHead(200, 'ok'); //ok 
        return res.end(); ; 

    } catch (error) {
        console.log(error);
        res.writeHead(500, 'server error'); //si fallo algo en el server
        return res.end();
        
    }

}

export const pagarPedido = async (req, res) => { 
    try {
        const pedido = serviceMethods.pagarPedido(req.body); 
        if (!pedido) {
            res.writeHead(404, 'not found'); //si no existe
            return res.end(); 
        }
        res.writeHead(200, 'ok');  
        return res.end(JSON.stringify(pedido)); 
    } catch {
        res.writeHead(500, 'server error'); //si fallo algo en el server
        return res.end();
    }
}

// export const addCouponToPedido = async (req, res) => { 
//     try {
//         const pedido = serviceMethods.addCouponToPedido(req.params.id, req.body); //id y un string del cupon
//         if (!pedido) {
//             res.writeHead(404, 'not found'); //si no existe
//             return res.end(); 
//         }
//         res.writeHead(200, 'ok');  
//         return res.end(JSON.stringify(pedido)); 
//     } catch {
//         res.writeHead(500, 'server error'); //si fallo algo en el server
//         return res.end();
//     }
// }


// export const verificarMesaDisponible = async (req,res) => { 
//     try {
//         const mesaDisp = await serviceMethods.verificarMesaDisponible(req.params.id);
//         res.json(mesaDisp);
//     } catch (error) {
//         console.log(error);
//         res.writeHead(500, 'server error'); //si fallo algo en el server
//         res.end();
//     }
// }

export const getPedidosPendientes = async(req, res) => {  
    try {
        const pedidos = await serviceMethods.getPedidosPendientes(req.user.id); 
        console.log(pedidos); //!sacar
        res.json(pedidos); 
    } catch (error) {
        console.log(error);
        res.writeHead(500, 'server error'); //si fallo algo en el server
        res.end();
    }
}




export default  { 
    createPedido,
    pagarPedido,
    //addCouponToPedido,
    //verificarMesaDisponible,
    getPedidosPendientes,
    cancelarPedidoPendiente,
}
