class ItemResDTO {
    constructor({id, nombre, descripcion, precio, categoriaId, tag, stock, ingredientes, imagen}) {
        this.id = id; 
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = parseFloat(precio);
        this.categoriaId = categoriaId;
        this.stock = stock;
        this.tag = tag; 
        //this.ingredientes = Array.isArray(ingredientes) ? ingredientes.map(String) : []; 
        this.imagen = imagen; //?URL de imagen?
    }

    static fromJson(data) { 
        return new ItemResDTO(data); 
    }
}

export default ItemResDTO;