export default(sequelize, DataTypes) => {
  return sequelize.define("PedidoItem", {
    pedidoId: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    itemId: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    cantidad: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      defaultValue: 1 
    },
  });
};