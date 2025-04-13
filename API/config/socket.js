import { Server } from 'socket.io';
import pedidosService from '../services/pedidoService.js';
import reservaService from '../services/reservaService.js';
import mesaService from '../services/mesaService.js';
import itemService from '../services/itemService.js';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
      allowedHeaders: ["my-custom-header"],
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true, // Para compatibilidad con versiones anteriores
    path: '/socket.io/' // Asegúrate que este sea el path correcto
  });

  console.log("✅ WebSockets inicializados");

  io.on("connection", (socket) => {
    console.log(`🟢 Usuario conectado: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`🔴 Usuario desconectado: ${socket.id}`);
    });



    // Escuchar eventos de confirmación de pedidos
    socket.on("pedido:cambiarEstado", async ({ pedidoId, estado }) => { 
      try {
        // Llamar al servicio que actualiza el estado en la base de datos
        const actualizado = await pedidosService.actualizarPedidoState(pedidoId, estado);
        if (actualizado) {
          // Emitir evento a TODOS los clientes conectados
          const pedidoActualizado = await pedidosService.getPedidoById(pedidoId);
          io.emit("pedido:estadoActualizado",  {pedidoId: pedidoId, estado: estado.estado, mesaId: pedidoActualizado.mesa.id}); //redundante?
        }
      } catch (error) {
        console.error("❌ Error actualizando pedido:", error);
      }
    });

    // Escuchar eventos de reservas
    socket.on("reserva:cambiarEstado", async ({ reservaId, estado }) => {
      console.log(estado)
      const actualizado = await reservaService.actualizarReservaState(reservaId, estado);
    
      if (actualizado) {
        // Emitir evento a TODOS los clientes conectados
        io.emit("reserva:estadoActualizado", { reservaId, estado: estado });
      }
    });
    socket.on("cambiarEstadoItem", async({itemId}) => {  //todo: cambiar el nombre a item:cambiarEstado
      console.log(itemId); 
      const actualizado = await itemService.updateStock(itemId);
  
    })

    //Escuchar eventos de mesas
    socket.on("mesa:cambiarEstado", async ({ mesaId, estado }) => {
      console.log(estado)
      const actualizado = await mesaService.updateEstadoMesa(mesaId, estado);
      if (actualizado) {
        // Emitir evento a TODOS los clientes conectados
        io.emit("mesa:estadoActualizado", { mesaId, estado: estado }); //redundante?
      }
    });

  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io no inicializado");
  }
  return io;
};

// exports = { initSocket, getIO };
