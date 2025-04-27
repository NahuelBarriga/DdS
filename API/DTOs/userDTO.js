class userDTO {  
    constructor({id, name, role, email, password}) { 
            this.id = id ? id:null;
            this.nombre = name;   
            this.cargo = role;
            this.email = email;
            this.password = password;
    }
}

export default userDTO;
