// services/pedidosService.js
import api from "./api.js";
import pedidoDTO from "../models/pedidoDTO.js"

// Asume que tienes una URL base definida en un archivo de configuración
const API_URL = `/carrito`;

// Enviar un nuevo pedido
export const postPedido = async (pedido) => {
    try {
        const pedidoNuevo = new pedidoDTO(pedido);
        const response = await api.post(API_URL, JSON.stringify(pedidoNuevo));  
        return response; 
    } catch (error) {  
        if (error.status == 403) { //token expirado
            refresh(); 
        } else { 
            console.error('Error en la solicitud: ', error); 
        }
    }
};


export const verificarMesaDisponible = async(mesaId) => { 
    try {
        const response = await api.get(`${API_URL}/mesa/${mesaId}`);
        return response.data;
    } catch (error) {
      if (error.status === 403) { // token expired
        refresh();
      } else {
        console.error('Error en la solicitud: ', error);
      }
      return null;
      
    }  
  }

// Obtener pedidos del cliente actual
export const getPedidosPendientes = async (clienteId) => {
  try { //todo: armar
    const response = await api.get(`${API_URL}/pedidos/cliente/${clienteId}`);
    return response.data.map(PedidoDTO.fromJson);
  } catch (error) {
    console.error('Error al obtener los pedidos del cliente:', error);
    throw error;
  }
};

export const cancelarPedidoPendiente = async(pedidoId) => { 
  try {
    const response = await api.delete(`${API_URL}/pedidos/${pedidoId}`);
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error cancelando pedido:', error);
    throw error;
  }
}

// // Actualizar estado de un pedido (para empleados)
// export const actualizarEstadoPedido = async (pedidoId, nuevoEstado) => {
//   try {
//     const response = await axios.patch(`${API_URL}/pedidos/${pedidoId}`, { estado: nuevoEstado });
//     return response;
//   } catch (error) {
//     console.error('Error al actualizar el estado del pedido:', error);
//     throw error;
//   }
// };

// // Obtener detalles de un pedido específico
// export const getPedidoDetalle = async (pedidoId) => {
//   try {
//     const response = await axios.get(`${API_URL}/pedidos/${pedidoId}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error al obtener los detalles del pedido:', error);
//     throw error;
//   }
// };