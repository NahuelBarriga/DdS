import pedidoMethods from "../services/pedidoService.js";
import itemMethods from "./itemService.js"
import repositoryMethods from "../repositories/pedidoRepository.js";
import PedidoDTO from "../DTOs/pedidoDTO.js";


export const createPedido = async (payload, cliente) => {
    try {
        const nuevoPedido = new PedidoDTO(payload);

        if (!compruebaItems(nuevoPedido.items)) {
            throw new Error('No hay stock suficiente para uno o más productos');
        }

        // Enriquecemos el pedido con snapshot del cliente
        const pedidoData = {
            ...nuevoPedido,
            clienteId: cliente.id,
            nombreCliente: cliente.name,
            direccionEntrega: cliente.address || "Sin dirección",
            ciudad: cliente.city || "Sin ciudad",
            telefonoCliente: cliente.telefono || "Sin teléfono",
            timestamp: new Date(),
        };

        const pedidoGuardado = await repositoryMethods.savePedido(pedidoData);

        // TODO: guardar items del pedido si corresponde

        await RabbitMQService.publish({
            type: "pedido_nuevo",
            id: pedidoGuardado.id,
            nombreCliente: pedidoGuardado.nombreCliente,
            direccionEntrega: pedidoGuardado.direccionEntrega,
            ciudad: pedidoGuardado.ciudad,
            telefonoCliente: pedidoGuardado.telefonoCliente,
            estado: pedidoGuardado.estado,
            repartidorAsignado: pedidoGuardado.repartidorAsignado
        });

        return pedidoGuardado;
    } catch (error) {
        console.error("Error en service.createPedido:", error);
        throw new Error("Error creando el pedido: " + error.message);
    }
};

const compruebaItems = async (items) => {
    try {
        items.forEach(async (item) => {
            const itemDisp = await itemMethods.getItemById(item.id);
            if (itemDisp.stock < item.cantidad) {
                return false;
            }
        });
        return true;
    } catch (error) {
        throw new Error('Error fetching pedido: ' + error.message); //! corregir el error que lanza
    }
}

export const cancelarPedidoPendiente = async (pedidoId) => {
    try {
        //getIO().emit("pedido:eliminado", (pedidoId)); 
        return await pedidoMethods.deletePedido(pedidoId);
    } catch (error) {
        throw new Error('Error fetching pedido: ' + error.message); //! corregir el error que lanza
    }
}


async function pagarPedido(pedidos) {
    try {
        const total = getTotal(pedidos);
        const pedidoDTO = total; //todo: parsear los datos para que sea un pedidoDTO
        pagoMethods.efectuarPago(pedidoDTO); //todo: ver como se hace el pago
        pedidos.forEach(pedido => {
            pedidoMethods.pagarPedido(pedido.id); //cierra los pedidos 
        });
    } catch (error) {
        throw new Error('Error fetching pedido: ' + error.message); //! corregir el error que lanza
    }
}


async function addItemsToPedido(pedido, items) {  //todo: ver esto pq en realidad deberia editar pq se pueden restar items
    try {

        const updatedPedido = pedido.items.add(items);
        return updatedPedido;

    } catch (error) {
        throw new Error('Error fetching pedido: ' + error.message); //! corregir el error que lanza
    }
}

// async function addCouponToPedido(pedido, coupon) {  //todo: acomodar
//     try {
//         pedido.coupon = coupon;
//         //todo: validar el cupon y guardar directamente en el campo de coupon del pedido el porcentaje de descuento
//         return pedido;
//     } catch (error) {
//         throw new Error('Error fetching pedido: ' + error.message); //! corregir el error que lanza
//     }
// }

// obtiene el total a pagar  
async function getTotal(pedidos) { //entra un objeto de pedidos 
    try {
        let total = 0;
        await Promise.all(pedidos.item.map(async (pedido) => {
            const PedidoDTO = await pedidoMethods.getPedidoById(pedido.id);
            if (!PedidoDTO) {
                throw new Error('Pedido not found'); //! corregir el error que lanza
            }
            PedidoDTO.items.forEach(item => {
                total += item.price;
            });
            if (PedidoDTO.coupon) {
                total = total * coupon; //aplica el descuento del cupon (validado cuando se aplica) 
            }
        }));
        return total;
    } catch (error) {
        throw new Error('Error fetching pedido: ' + error.message); //! corregir el error que lanza
    }
}

// export const verificarMesaDisponible = async (mesaNumero) => { 
//     try {
//         const mesa = await mesaMethods.getMesaByNumero(mesaNumero);
//         return (mesa.estado === 'ocupada');      
//     } catch (error) {
//         throw new Error('Error fetching pedido: ' + error.message); //! corregir el error que lanza
//     }
// }

export const getPedidosPendientes = async (clienteId) => {
    try {
        let filter = {
            estado: 'pendiente',
            clienteId: clienteId,
        };
        const pedidos = await pedidoMethods.getAllPedidos(filter);
        filter = {
            estado: 'confirmado',
            clienteId: clienteId,
        };
        const pedidosConfirmados = await pedidoMethods.getAllPedidos(filter);
        pedidos.push(...pedidosConfirmados);
        return pedidos;
    } catch (error) {
        throw new Error('Error fetching pedido: ' + error.message); //! corregir el error que lanza
    }
}






export default {
    getPedidosPendientes,
    //addCouponToPedido,
    addItemsToPedido,
    createPedido,
    pagarPedido,
    getTotal,
    //verificarMesaDisponible,
    cancelarPedidoPendiente,
};