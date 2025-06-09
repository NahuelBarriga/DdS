export default (sequelize, DataTypes) => {
  return sequelize.define("Pedido", {
    clienteId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM(
        'pendiente',
        'pagado',
        'confirmado',
        'rechazado',
        'listo para enviar',
        'entregado',
        'entrega cancelada'),
      allowNull: false,
      defaultValue: "pendiente" 
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    subtotal: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    comentario: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombreCliente: {
        type: DataTypes.STRING,
        allowNull: true
    },
    direccionEntrega: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ciudad: {
        type: DataTypes.STRING,
        allowNull: true
    },
    telefonoCliente: {
        type: DataTypes.STRING,
        allowNull: true
    },
  });
  
};