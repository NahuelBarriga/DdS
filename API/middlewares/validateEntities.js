// Propósito: Validar las entidades que se reciben
var actualDate = new Date();

export const validateReserva = ({timestamp, cantPersonas, mesa, cliente}) => { 
    if (!timestamp || timestamp === '' || timestamp < actualDate) {
        throw new Error('Fecha is required');
    }

    if (!cantPersonas || cantPersonas <= 0) {
        throw new Error('cantPersonas is required');
    }
    if (!mesa) {
        throw new Error('mesaId is required');
    }
    if (!clienteId || clienteId == '') {
        throw new Error('clienteId is required');
    }
    
    return true;
    //esto no se valida en el controlador pq se agrega en la logica del servicio, el estado se asigna automaticamente post esta verificacion
    // if (!reservaDTO.mesaId) { 
    //     throw new Error('MesaId is required');
    // }
}

export const validateItem = ({nombre, descripcion, precio, categoriaId}) => { //el tag, descripcion, ingredientes y foto son opcionales 
    if (!nombre || nombre === '') { 
        throw new Error('Nombre is required');
    }
    if (!descripcion || descripcion === '') { 
        throw new Error('Descripcion is required');
    }
    if (!categoriaId) { //verifica que pertenece a una existente en service
        throw new Error('Categoria is required'); 
    }
    if (!precio || precio <= 0) {
        throw new Error('Precio is required');
    }
    return true;
}


// export const validateMesa = (mesaDTO) => {  
//     if (!mesaDTO.locacion || mesaDTO.locacion === '') {
//         throw new Error('Locacion is required');
//     }
//     return true;
// }

export const validateCaja = ({monto, tag, descripcion}) => { 
    if (!monto || monto <= 0) {
        throw new Error('Monto is required');
    }
    if (!tag) {
        throw new Error('Tag is required');
    }
    if (!descripcion) {
        throw new Error('Descripcion is required');
    }
    return true;
} 

export const validateEmpleado = ({nombre, apellido, contrasena, telefono, cargo}) => { 
    if (!nombre || nombre === '') {
        throw new Error('Nombre is required');
    }
    if (!apellido || apellido === '') {
        throw new Error('Apellido is required');
    }
    if (!contrasena || contrasena === '') {
        throw new Error('Contrasena is required');
    }
    if (!telefono || telefono === '') {
        throw new Error('Telefono is required');
    }
    const cargos = ['empleado', 'gerente', 'adm', 'cliente'];
    if (!cargo || cargo === '' || !cargos.includes(cargo)) {
        throw new Error('Cargo valido is required');
    }
    return true;

}

export const validateCliente = ({nombre, apellido, telefono, mail, cumpleanos}) =>  {
    if (!nombre || nombre === '') {
        throw new Error('Nombre is required');
    }
    if (!apellido || apellido === '') {
        throw new Error('Apellido is required');
    }
    if (!contrasena || contrasena === '') {
        throw new Error('Contrasena is required');
    }
    if (!telefono || telefono === '') { //por ahi no hace falta
        throw new Error('Telefono is required');
    }
    if (!mail || mail === '') {
        throw new Error('Mail is required');
    }
    if (!cumpleanos || cumpleanos === '') {
        throw new Error('Cumpleanos is required');
    }
    return true;
}

export const validateCategoria = (categoriaDTO) => { 
    if (!categoriaDTO.nombre || categoriaDTO.nombre === '') {
        throw new Error('Nombre is required');
    }
    return true;
}

export const validatePedido = (pedidoDTO) => { 
    if (!pedidoDTO.clienteId) {
        throw new Error('ClienteId is required');
    }
    if (!pedidoDTO.items || pedidoDTO.items.length === 0) {
        throw new Error('Items are required');
    }
    return true;
}

