class authDTO { 
    constructor({id, nombre, cargo}) { 
            this.id = Number(id);
            this.nombre = String(nombre);   
            this.cargo = String(cargo);
    }
}

export default authDTO;
