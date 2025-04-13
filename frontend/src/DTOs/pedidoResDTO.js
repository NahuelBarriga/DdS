class PedidoResDTO {
    constructor({id, items, comentario, total, coupon, mesa, estado, cliente, timestamp, employeeId}) {
        this.id = Number(id); //autoasignada
        this.items = Array.isArray(items) ? items.map(item => { 
            return {
                id: item.id,
                nombre: item.nombre,
                precio: item.precio,
                cantidad: item.cantidad 
            }
        }) : []; 
        this.comentario = String(comentario); // opcional
        this.total = parseFloat(total); //se calcula automaticamente en funcion de los items
        this.coupon = String(coupon); //opcional
        this.cliente = cliente ? { 
            id: cliente.id,
            nombre: cliente.nombre,
            apellido: cliente.apellido,
            telefono: cliente.telefono
        } : 'undefined'; // se agrega despues
        this.dia = timestamp.split("T")[0];
        this.hora =  timestamp.split("T")[1].slice(0, 5);
        this.mesa = mesa; 
        this.employeeId=Number(employeeId);
        this.estado = String(estado); 
    }
    static fromJson(data) { 
        return new PedidoResDTO(data); 
    }
}

export default PedidoResDTO;