class ItemDTO {
    constructor({nombre, descripcion, precio, categoriaId, tag, ingredientes, imagen}) {
        this.nombre = String(nombre);
        this.descripcion = String(descripcion);
        this.precio = Number(precio);
        this.categoriaId = String(categoriaId); 
        this.stock = true; //por default disponible
        this.tag = String(tag); 
        //this.ingredientes = Array.isArray(ingredientes) ? ingredientes.map(String) : []; 
        this.imagen = imagen; //todo: ver que onda
    }
    static fromJson(data) { 
        return new ItemDTO(data); 
    }
}

export default ItemDTO;