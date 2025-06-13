class PedidoDTO {
    constructor({id, total, estado, timestamp, cliente, items}) {
        this.id = id ? id: null; 
        this.items = Array.isArray(items) ? items.map((item) => ({
            id: Number(item.id),
            nombre: String(item.nombre), 
            precio: Number(item.precio),
            cantidad: item.PedidoItem ? Number(item.PedidoItem.cantidad) : Number(item.cantidad), //va asi por un tema de formateo falopa de sequelize, no recomiendo tocar, perdi 40 horas intentando acomodarlo :)
        })): [];
        this.cliente = cliente
      ? {
          id: cliente.id,
          nombre: cliente.name,
          direccion: cliente.address || "Sin dirección",
          ciudad: cliente.city || "Sin ciudad",
          telefono: cliente.telefono || "Sin teléfono"
        }
      : null;
        this.timestamp = timestamp ? timestamp: new Date(new Date(timestamp).getTime() - new Date(timestamp).getTimezoneOffset() * 60000);
        //this.timestamp = new Date(timestamp.getTime() - timestamp.getTimezoneOffset() * 60000);
        this.total = Number(total); //se calcula automaticamente en funcion de los items
        this.estado = String(estado); 
    }
}

export default PedidoDTO;