import fs from 'fs';
import path from 'path';
import Pool from 'pg'; // Assuming you are using pg for PostgreSQL
import {prueba, dirDB} from '../config/devConfig.js'; 
import { Op } from 'sequelize';
import db from '../database/index.js';


const __dirname = dirDB;
const { Pedido, PedidoItem } = db; 

const dbFilePath = path.resolve(__dirname + '/DBPrueba.json');

const readDB = () => {
    const data = fs.readFileSync(dbFilePath);
    return JSON.parse(data);
};

const writeDB = (data) => {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
};

const getAll = async (filter) => {
    if (prueba) {
        const db = readDB();
        return db.pedidos; 
        
    } else {
        try {
            const whereClause = {};
            if (filter.estado) whereClause.estado = filter.estado;
            if (filter.clienteId) whereClause.clienteId = filter.clienteId;
            if (filter.mesaId) whereClause.mesaId = filter.mesaId;
            if (filter.fechaInicio) whereClause.timestamp = { ...whereClause.date, [Op.gte]: filter.fechaInicio };
            if (filter.fechaFin) whereClause.timestamp = { ...whereClause.date, [Op.lte]: filter.fechaFin };
            return await Pedido.findAll({ 
                where: whereClause,
                include: filter.include,
                order: [
                ['createdAt', 'DESC']
                ],
            });
   
          } catch (error) {
               console.log(error); 
               throw new Error('Error fetching reservas: ' + error.message);
          }
    }
};

const findPedidoById = async (pedidoId, include) => {
    if (prueba) {
        const data = await fs.readFile(dbFilePath, 'utf8');
        const pedidos = JSON.parse(data);
        return pedidos.find(pedido => pedido.id === pedidoId);
    } else {
        return await Pedido.findByPk(pedidoId, {
            include: include.include,
        });
    }

};

const updatePedido = async (pedidoId, pedidoData) => {
    if (prueba) {
        const data = await fs.readFile(dbFilePath, 'utf8');
        const pedidos = JSON.parse(data);
        const index = pedidos.findIndex(pedido => pedido.id === pedidoId);
        if (index !== -1) {
            Object.assign(pedidos[index], updateData);
            await fs.writeFile(dbFilePath, JSON.stringify(pedidos, null, 2));
            return pedidos[index];
        }
        return null;
    } else {
        try {
            // Actualizar los datos principales del pedido
            const [numUpdated] = await Pedido.update(pedidoData, {
                where: { id: Number(pedidoId) }
            });
            
            if (numUpdated === 0) {
                throw new Error(`Pedido con ID ${pedidoId} no encontrado`);
            }
            
            // Actualizar items - primero eliminar los existentes
            await PedidoItem.destroy({
                where: { pedidoId: Number(pedidoId) }
            });
            
            // Luego crear los nuevos items
            const itemsPedido = pedidoData.items.map(item => ({
                pedidoId: Number(pedidoId),
                itemId: item.id,
                cantidad: item.cantidad
            }));
            
            await PedidoItem.bulkCreate(itemsPedido);
            
            // Obtener el pedido actualizado para devolverlo
            const pedidoActualizado = await Pedido.findByPk(pedidoId);
            return pedidoActualizado;
            
        } catch (error) {
            console.error(error);
            throw new Error('Error al actualizar el pedido: ' + error.message);
        }
    }
};

const savePedido = async (pedidoData) => {
    if (prueba) {
        const data = await fs.readFile(dbFilePath, 'utf8');
        const pedidos = JSON.parse(data);
        const newPedido = { id: pedidos.length + 1, ...pedidoData };
        pedidos.push(newPedido);
        await fs.writeFile(dbFilePath, JSON.stringify(pedidos, null, 2));
        return newPedido;
    } else {
        try {
            const nuevoPedido = await Pedido.create({ 
                clienteId: pedidoData.clienteId,
                mesaId: pedidoData.mesaId,
                comentario: pedidoData.comentario,
                subtotal: pedidoData.subtotal,
                total: pedidoData.total,
                coupon: pedidoData.coupon,
                estado: pedidoData.estado,
                timestamp: pedidoData.timestamp,
            }); 
            const itemsPedido = pedidoData.items.map(item => ({
                pedidoId: nuevoPedido.id, // ID del pedido recién creado
                itemId: item.id,
                cantidad: item.cantidad
            }));

            await PedidoItem.bulkCreate(itemsPedido);
            return nuevoPedido;

        } catch (error) {
            console.error(error);
            throw new Error('Error al crear el pedido: ' + error.message);
        }
        
    }
};

const deletePedido = async (pedidoId) => {
    if (prueba) {
        const data = await fs.readFile(dbFilePath, 'utf8');
        const pedidos = JSON.parse(data);
        const index = pedidos.findIndex(pedido => pedido.id === pedidoId);
        if (index !== -1) {
            const deletedPedido = pedidos.splice(index, 1)[0];
            await fs.writeFile(dbFilePath, JSON.stringify(pedidos, null, 2));
            return deletedPedido;
        }
        return null;
    } else {
        try {
            return await Pedido.destroy({
                where: {
                    id: pedidoId
                }
            });
        } catch (error) {
            console.log(error); 
            throw new Error('Error deleting reserva: ' + error.message);
        }
    }
};

export default {
    getAll,
    findPedidoById,
    updatePedido,
    savePedido,
    deletePedido
};