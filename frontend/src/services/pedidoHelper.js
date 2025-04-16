import api from './api'; 
import pedidoDTO from '../models/pedidoDTO';
import {API_PORT, MODO_PRUEBA} from '../config';

const API_URL = `/pedidos`;

const mockPedidos = [
    { id: 1, cliente: {nombre: 'Juan', apellido: 'Perez'}, fecha:  '9/2 ',hora: '18:00', items: [{ id: 1, nombre: "Cafe", precio: 1600},{ id: 4, nombre: "Tostada", precio: 2500}], total: 4100, estado: 'aceptado'},
    { id: 2, cliente: {nombre: 'Marcos', apellido: 'Sanchez'},fecha:  '9/2 ', hora: '19:00', items: [{ id: 2, nombre: "Te", precio: 1600}], comentario: 'jugo con hielo', total: 2000, estado: 'rechazado'},
    { id: 3, cliente: {nombre: 'Maria', apellido: 'Sheiw'},fecha:  '10/2 ', hora: '16:00', items: [{ id: 3, nombre: "Jugo", precio: 2000}, { id: 5, nombre: "Medialuna", precio: 1200}], total: 3200, estado: 'pendiente'},
  ];

export const getPedidos = async () => {
    if (MODO_PRUEBA) {
      console.log("⚠️ Usando datos MOCK para las pedidos");
      return new Promise((resolve) => setTimeout(() => resolve(mockPedidos), 500)); // Simula un delay de 500ms
    }
    try {
      const response = await api.get(API_URL);
      console.log(response.data); //!sacar 
      console.log(response.data.map(pedidoDTO.fromJson));//!sacar 
      return response.data.map(pedidoDTO.fromJson);
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
      return [];
    }
  };


export const postReserva = async (reserva) => {
  try {
    const response = await api.post(`${API_URL}/reserva`, reserva);
    return response.data;
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    return null;
  }
};

export const patchReserva = async (id, updates) => {
  try {
    const response = await api.patch(`${API_URL}/reserva/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la reserva:", error);
    return null;
  }
};

export const deleteReserva = async (id) => {
  try {
    const response = await api.delete(`${API_URL}/reserva/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar la reserva:", error);
    return null;
  }
};

export const confirmarORechazarPedido = async (pedidoId, estado) => {
  try {
    socket.emit("pedido:estadoActualizado", { pedidoId, estado});
  } catch (error) {
    console.error("Error al confirmar o rechazar el pedido:", error);
    return null;
  }
};

export const getItemsMenu = async() => { 
  try {
    const response = await api.get(`/productos`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    return [];
  }
}
