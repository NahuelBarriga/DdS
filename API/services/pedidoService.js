import repositoryMethods from "../repositories/pedidoRepository.js"; //metodos de comunicacion con la db
import pedidoDTO from '../DTOs/pedidoDTO.js'
import db from '../database/index.js'

const {Cliente, Mesa, Item} = db;

// Get all pedidos
export const getAllPedidos = async ({ estado, clienteId, mesaId, fechaInicio, fechaFin }) => {
    try {
        const pedidos = await repositoryMethods.getAll({
            estado,
            clienteId,
            mesaId,
            fechaInicio,
            fechaFin,
            include: [
                {model: Cliente, as: 'cliente', attributes: ['id', 'nombre', 'telefono'] },
                { model: Mesa, as: 'mesa' ,attributes: ['id'] },
                { model: Item, as: 'items' ,attributes: ['id', 'nombre', 'precio'], through: { attributes: ['cantidad'] } } // Evita datos innecesarios de la tabla intermedia
            ]
        });
        // const cacheKey = 'pedidos';
        return pedidos.map(pedido => new pedidoDTO(pedido));
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching pedidos: ' + error.message);
    }
};

// Get a pedido by ID
export const getPedidoById = async(pedidoId) => {
    try {
        const pedido = await repositoryMethods.findPedidoById(pedidoId, {
            include: [
                {model: Cliente, as: 'cliente', attributes: ['id', 'nombre', 'telefono'] },
                { model: Mesa, as: 'mesa' ,attributes: ['id'] },
                { model: Item, as: 'items' ,attributes: ['id', 'nombre', 'precio'], through: { attributes: ['cantidad'] } } // Evita datos innecesarios de la tabla intermedia
            ]
        });
        if (!pedido) {
            throw new Error('Pedido not found'); //! corregir el error que lanza
        }
        return new pedidoDTO(pedido);
    } catch (error) {
        throw new Error('Error fetching pedido: ' + error.message); //! corregir el error que lanza
    }
}


export const actualizarPedidoState = async(pedidoId, estado) => {
    try {
        const pedido = await getPedidoById(pedidoId);
        if (!pedido) {
            throw new Error('Pedido not found'); //! corregir el error que lanza
        }
        pedido.clienteId = pedido.cliente.id;
        pedido.mesaId = pedido.mesa.id;
        pedido.estado = estado.estado; //actualiza el estado
        return await repositoryMethods.updatePedido(pedidoId, new pedidoDTO(pedido)); 
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching pedido: ' + error.message); //! corregir el error que lanza
    }
}

export const registrarPagoPedido = async(pedidoId) => { //solo registra el pago en el estado, el pago se gestiona desde carrito
    actualizarPedidoState(pedidoId, 'pago');  //!ver si sacar esto o que hacer
}

// Update a pedido by ID
export const updatePedido = async(pedidoId, pedidoUpdate) => { //todo: ver si sirve dejarlo
    try {
        const include = [
            {model: Cliente, as: 'cliente', attributes: ['id', 'nombre', 'telefono'] },
            { model: Mesa, as: 'mesa' ,attributes: ['id'] },
            { model: Item, as: 'items' ,attributes: ['id', 'nombre', 'precio'], through: { attributes: ['cantidad'] } } // Evita datos innecesarios de la tabla intermedia
        ]
        const pedido = new pedidoDTO(await repositoryMethods.findPedidoById(pedidoId, include));
        if (!pedido) {
            throw new Error('Pedido not found');
        }

        pedidoUpdate.clienteId = pedido.cliente.id; 
        pedidoUpdate.timestamp = pedido.timestamp; 
        const response = await repositoryMethods.updatePedido(pedidoId, new pedidoDTO(pedidoUpdate)); 
        console.log(response);
        return response;
    } catch (error) {
        throw new Error('Error updating pedido: ' + error.message);
    }
}


// Delete a pedido by ID
export const deletePedido = async(pedidoId) => {
    try {
        return await repositoryMethods.deletePedido(pedidoId); //si no devuelve nada hay exito
    } catch (error) {
        throw new Error('Error deleting pedido: ' + error.message);
    }
}

async function notifyPedido() {
    
}  


export default {
    getPedidoById,
    updatePedido,
    deletePedido,
    getAllPedidos,
    actualizarPedidoState,
    registrarPagoPedido,
    notifyPedido
};