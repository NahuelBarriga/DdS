class categoriaDTO { 
    constructor({id, nombre}) {
        this.id = Number(id) ? id:null ; 
        this.nombre = String(nombre);
    }
}
export default categoriaDTO; 


