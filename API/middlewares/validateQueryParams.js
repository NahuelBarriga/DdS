const validateUsuarioQueryParams = (req, res, next) => { 
    const { cargo } = req.query;
  
    const cargoValidos = ['empleado', 'cliente', 'gerente', 'administrador'];
  
    if (cargo && !cargoValidos.includes(cargo)) {
      return res.status(400).json({ message: `Cargo inválido. cargo válidos: ${cargoValidos.join(', ')}` });
    }  
 
    next(); // Pasar al siguiente middleware o controlador
  };
  

const validatePedidoQueryParams = (req, res, next) => { 
  const { estado, fechaInicio, fechaFin, clienteId, mesaId, } = req.query;

  const estadosValidos = ['pendiente', 'procesando', 'completado', 'cancelado'];

  if (estado && !estadosPedidoValidos.includes(estado)) {
    return res.status(400).json({ message: `Estado inválido. Estados válidos: ${estadosValidos.join(', ')}` });
  }

  if (clienteId && isNaN(Number(clienteId))) {
    return res.status(400).json({ message: 'clienteId debe ser un número válido' });
  }

  if (mesaId && isNaN(Number(mesaId))) {
    return res.status(400).json({ message: 'mesaId debe ser un número válido' });
  }

  //if (fechaInicio && ) //todo: ver como comprobar si es o no una fecha valida
  //if (fechaFin && ) //todo: ver como comprobar si es o no una fecha valida

  next(); // Pasar al siguiente middleware o controlador
};

const validateCajaQueryParams = (req, res, next) => { //!acomodar todo, esta asi solo para que aparezca el metodo y me acuerde de la estructura basica. 
  const { tag, fechaInicio, fechaFin, montoMin, montoMax } = req.query;

  const tagsValidos = ['B', 'N']; 

  if (tag && !tagsValidos.includes(tag)) {
    return res.status(400).json({ message: `tag inválido. tags válidos: ${tagsValidos.join(', ')}` });
  }

    //if (fechaInicio && ) //todo: ver como comprobar si es o no una fecha valida
  //if (fechaFin && ) //todo: ver como comprobar si es o no una fecha valida

  if (montoMax && (isNaN(Number(montoMax)) || montoMax < 0)) {
    return res.status(400).json({ message: 'montoMax debe ser un número válido'});
  }

  if (montoMin && (isNaN(Number(montoMin)) || montoMin < 0)) {
    return res.status(400).json({ message: 'montoMin debe ser un número válido'});
  }

  if (montoMax && montoMin && montoMin>montoMax) { 
    return res.status(400).json({ message: 'montoMin no debe ser mayor a montoMax'});
  }


  next(); // Pasar al siguiente middleware o controlador
};

const validateItemQueryParams = (req, res, next) => { 
  const { estado, categoria, precioMax, precioMin, tag } = req.query;

  const estadosValidos = ['disponible', 'no disponible'];
  const tagsValidos = ['GF', 'Veg', 'V']; 
  // Validar estado si está presente

  if (estado && !estadosValidos.includes(estado)) {
    return res.status(400).json({ message: `Estado inválido. Estados válidos: ${estadosValidos.join(', ')}` });
  }

  if (tag && !tagsValidos.includes(estado)) {
    return res.status(400).json({ message: `tag inválido. tags válidos: ${tagsValidos.join(', ')}` });
  }

  //if (categoria && ) //todo: ver si categoria tiene numeros o algo asi 

  
  if (precioMax && (isNaN(Number(precioMax)) || precioMax < 0)) {
    return res.status(400).json({ message: 'precioMax debe ser un número válido'});
  }

  if (precioMin && (isNaN(Number(precioMin)) || precioMin < 0)) {
    return res.status(400).json({ message: 'precioMin debe ser un número válido'});
  }

  if (precioMax && precioMin && precioMin>precioMax) { 
    return res.status(400).json({ message: 'precioMin no debe ser mayor a precioMax'});
  }

  next(); // Pasar al siguiente middleware o controlador
};

const validateMesaQueryParams = (req, res, next) => { 
  const { estado } = req.query;

  const estadosValidos = ['libre', 'ocupada', 'reservada'];

  if (estado && !estadosValidos.includes(estado)) {
    return res.status(400).json({ message: `Estado inválido. Estados válidos: ${estadosValidos.join(', ')}` });
  }

  next(); // Pasar al siguiente middleware o controlador
};

const validateReservaQueryParams = (req, res, next) => { 
  const { estado, fechaInicio, fechaFin, clienteId, mesaId, } = req.query;

  const estadosValidos = ['pendiente', 'confirmada', 'rechazada'];

  if (estado && !estadosValidos.includes(estado)) {
    return res.status(400).json({ message: `Estado inválido. Estados válidos: ${estadosValidos.join(', ')}` });
  }

  if (clienteId && isNaN(Number(clienteId))) {
    return res.status(400).json({ message: 'clienteId debe ser un número válido' });
  }

  if (mesaId && isNaN(Number(mesaId))) {
    return res.status(400).json({ message: 'mesaId debe ser un número válido' });
  }

  //if (fechaInicio && ) //todo: ver como comprobar si es o no una fecha valida
  //if (fechaFin && ) //todo: ver como comprobar si es o no una fecha valida

  next(); // Pasar al siguiente middleware o controlador
};

const validateStatsQueryParams = (req, res, next) => { //!acomodar todo, esta asi solo para que aparezca el metodo y me acuerde de la estructura basica. 


  next(); // Pasar al siguiente middleware o controlador
};

export default { 
  validateCajaQueryParams, 
  validateItemQueryParams,
  validateMesaQueryParams,
  validatePedidoQueryParams,
  validateReservaQueryParams,
  validateStatsQueryParams, 
  validateUsuarioQueryParams
};