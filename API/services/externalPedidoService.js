import axios from 'axios';

class ExternalPedidoService {
    constructor() {
        this.baseURL = process.env.PEDIDOS_SERVICE_URL || 'http://localhost:3003'; // Parametrizar para usar .env
    }

    async createExternalPedido(pedidoData) {
        try {
            const response = await axios.post(`${this.baseURL}/api/pedidos`, {
                nombreCliente: pedidoData.nombreCliente,
                direccionEntrega: pedidoData.direccionEntrega,
                ciudad: pedidoData.ciudad,
                telefonoCliente: pedidoData.telefonoCliente,
                items: pedidoData.items
            });

            return response.data;
        } catch (error) {
            console.error('Error creating external pedido:', error.data);
            throw new Error(`Failed to create external pedido: ${error.message}`);
        }
    }
}

export default new ExternalPedidoService(); 