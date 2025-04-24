class ItemDTO {
    constructor({id, nombre, descripcion, precio, categoriaId, tag, stock, imagen}) {
        this.id = Number(id); //se asigna automaticamente en la db
        this.nombre = String(nombre);
        this.descripcion = String(descripcion);
        this.precio = Number(precio);
        this.categoriaId = Number(categoriaId);
        this.stock = stock !== undefined ? Boolean(stock) : true;
        this.tag = String(tag); 
        this.imagen = imagen; //?URL de imagen?
    }
}

export default ItemDTO;