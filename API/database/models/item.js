
export default(sequelize, DataTypes) => {
  return sequelize.define("Item", {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    categoriaId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stock: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: true
    },
    imagenId: { 
      type: DataTypes.INTEGER, 
      allowNull: true, 
    }
  });
};