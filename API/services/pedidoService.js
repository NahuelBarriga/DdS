import repositoryMethods from "../repositories/pedidoRepository.js"; //metodos de comunicacion con la db
import pedidoDTO from '../DTOs/pedidoDTO.js'
import db from '../database/index.js'
import externalPedidoService from "./externalPedidoService.js";

const {User, Item} = db;

// Get all pedidos
export const getAllPedidos = async ({ estado, clienteId, fechaInicio, fechaFin }) => {
    try {
        const pedidos = await repositoryMethods.getAll({
            estado,
            clienteId,
            fechaInicio,
            fechaFin,
            include: [
                { model: Item, as: 'items' ,attributes: ['id', 'nombre', 'precio'], through: { attributes: ['cantidad'] } }, // Evita datos innecesarios de la tabla intermedia,
                { model: User, as: 'cliente', attributes: ['id', 'name'] } // Evita datos innecesarios de la tabla intermedia
            ]
        });
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
                {model: User, as: 'cliente', attributes: ['id', 'nombre', 'telefono'] },
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

export const getPedidosByUserId = async(clienteId) => { 
    try {
        const pedidos = await repositoryMethods.getPedidosByUserId(clienteId); 
        if (!pedidos) {
            throw new Error('Pedidos not found'); //! corregir el error que lanza
        }
        return pedidos.map(pedido => new pedidoDTO(pedido));
    } catch (error) {
        throw new Error('Error fetching pedidos: ' + error.message); //! corregir el error que lanza
    }
}

export const pagarPedido = async(pedidoId, body) => { //paga un pedido segun su ID
    try {
        // Get existing pedido first
        const existingPedido = await repositoryMethods.findPedidoById(pedidoId, {
            include: [
                { model: Item, as: 'items', attributes: ['id', 'nombre', 'precio'], through: { attributes: ['cantidad'] } }
            ]
        });

        if (!existingPedido) {
            throw new Error('Pedido not found');
        }

        // Create external pedido first
        const externalPedido = await externalPedidoService.createExternalPedido({
            nombreCliente: body.nombreCliente,
            direccionEntrega: body.direccionEntrega,
            ciudad: body.ciudad,
            telefonoCliente: body.telefonoCliente
        });

        // Update local pedido with external ID and mark as paid, preserving items
        const updateData = {
            ...existingPedido.toJSON(),
            externalPedidoId: String(externalPedido.id),
            estado: externalPedido.estado
        };

        await repositoryMethods.updatePedido(pedidoId, updateData);

        return await repositoryMethods.findPedidoById(pedidoId);
    } catch (error) {
        console.log("Hubo un error actualizando el pedido: ", error);
        throw new Error('Error al pagar pedido: ' + error.message);
    }
}

export const rechazarPedido = async(pedidoId) => { //rechaza un pedido segun su ID
    try {
        return repositoryMethods.updateEstado(pedidoId, 'rechazado'); //actualiza el estado a rechazado
    } catch (error) {
        throw new Error('Error fetching pedido: ' + error.message);
    }
}

export const enviarPedido = async(pedidoId) => { //confirma un pedido segun su ID
    try {
        return repositoryMethods.updateEstado(pedidoId, 'enviado'); //actualiza el estado a enviado
    } catch (error) {
        throw new Error('Error fetching pedido: ' + error.message);
    }
}

async function notifyPedido() {
    
}  

export const handleStatusUpdate = async(message) => {
    try {
        const { pedidoId, nuevoEstado } = message;
        
        // Find pedido by externalPedidoId
        const pedido = await repositoryMethods.findPedidoByExternalId(pedidoId);
        if (!pedido) {
            console.log(`Pedido with external ID ${pedidoId} not found`);
            return null;
        }

        // Update the estado
        return await repositoryMethods.updateEstado(pedido.id, nuevoEstado);
    } catch (error) {
        console.error('Error updating pedido status:', error.message);
        return null;
    }
}

export default {
    getPedidoById,
    updatePedido,
    deletePedido,
    getAllPedidos,
    actualizarPedidoState,
    registrarPagoPedido,
    notifyPedido,
    getPedidosByUserId,
    pagarPedido,
    rechazarPedido,
    enviarPedido,
    handleStatusUpdate
};