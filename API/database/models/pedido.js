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
        'confirmado',
        'rechazado',
        'finalizado',
        'pago pendiente',
        'pagado',
        'enviado',
        'entregado'),
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
  });
  
};