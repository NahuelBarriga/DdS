class PedidoResDTO {
    constructor({id, comentario, total, coupon, estado, employeeId, timestamp, mesaId, cliente, items}) {
        this.id = Number(id); 
        this.items = Array.isArray(items) ? items.map((item) => ({
            
            id: Number(item.id),
            nombre: String(item.nombre), 
            precio: Number(item.precio),
            cantidad: item.PedidoItem ? Number(item.PedidoItem.cantidad) : Number(item.cantidad), //va asi por un tema de formateo falopa de sequelize, no recomiendo tocar, perdi 40 horas intentando acomodarlo :)
        })): [];
        this.mesa = mesaId? { id: mesaId } : null;
        this.cliente = cliente? {
            id: cliente.id, 
            nombre: cliente.nombre,
            //apellido: cliente.apellido,
        } : null;
        this.comentario = String(comentario); // opcional
        this.coupon = String(coupon); //opcional
        this.timestamp = new Date(timestamp.getTime() - timestamp.getTimezoneOffset() * 60000);
        this.total = Number(total); //se calcula automaticamente en funcion de los items
        this.employeeId = employeeId ? Number(this.employeeId) : null; //se agrega en confirmacion de pedido
        this.estado = String(estado); 
    }
}

export default PedidoResDTO;