class userDTO {  
    constructor({id, name, role, email, password,city, address, telefono}) { 
            this.id = id ? id:null;
            this.nombre = name;   
            this.cargo = role;
            this.email = email;
            this.password = password;
            this.city = city ? city : null;
            this.address = address ? address : null;
            this.telefono = telefono ? telefono : null;
    }
}

export default userDTO;
