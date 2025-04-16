import pedidoDTO from "../DTOs/pedidoDTO.js";
import pedidoMethods from "../services/pedidoService.js";
import itemMethods from "./itemService.js"
import repositoryMethods from "../repositories/pedidoRepository.js";



export const createPedido = async(pedido, cargo) => { 
    try { 
        const nuevoPedido = new pedidoDTO(pedido);
        // if (cargo != 'cliente') { //lo hizo un empleado, se aprueba directo //viene del front
        //     nuevoPedido.estado = 'aprobado'; 
        // }
        if (!compruebaItems(nuevoPedido.items)) {//chequea que haya stock de todos los items, por si estaba en carrito y despues se saco 
            throw new Error('Error en los items del pedido'); //! corregir el error que lanza
        }
        
        const pedidoNuevo =  await repositoryMethods.savePedido(nuevoPedido);
        getIO().emit("pedido:nuevo", (await pedidoMethods.getPedidoById(pedidoNuevo.id)));  //ya viene con DTO 
        return pedidoNuevo; 

    } catch (error) {
        console.log(error);
        throw new Error('Error fetching pedido: ' + error.message); //! corregir el error que lanza
    }
}

const compruebaItems = async (items) => {
    try {
        items.forEach(async(item) => {
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

export const cancelarPedidoPendiente = async(pedidoId) => { 
    try {
        getIO().emit("pedido:eliminado", (pedidoId)); 
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
        throw new Error('Error creating pedido: ' + error.message); //! corregir el error que lanza
    }
}

async function addCouponToPedido(pedido, coupon) {  //todo: acomodar
    try {
        pedido.coupon = coupon;
        //todo: validar el cupon y guardar directamente en el campo de coupon del pedido el porcentaje de descuento
        return pedido;
    } catch (error) {
        throw new Error('Error fetching pedido: ' + error.message); //! corregir el error que lanza
    }
}

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
    }catch (error) {
        throw new Error('Error fetching pedido: ' + error.message); //! corregir el error que lanza
    }
}

export const verificarMesaDisponible = async (mesaNumero) => { 
    try {
        const mesa = await mesaMethods.getMesaByNumero(mesaNumero);
        return (mesa.estado === 'ocupada');      
    } catch (error) {
        throw new Error('Error fetching pedido: ' + error.message); //! corregir el error que lanza
    }
}

export const getPedidosPendientes = async(clienteId) => {  
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






export default  {
    getPedidosPendientes,
    addCouponToPedido,
    addItemsToPedido,
    createPedido,
    pagarPedido,
    getTotal,
    verificarMesaDisponible,
    cancelarPedidoPendiente,
};