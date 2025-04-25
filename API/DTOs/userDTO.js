class userDTO {  //! acomodar esto, esta copypasteado de authDTO
    constructor({id, name, role}) { 
            this.id = Number(id);
            this.nombre = String(name);   
            this.cargo = String(role);
    }
}

export default userDTO;
