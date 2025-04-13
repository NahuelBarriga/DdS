export default (sequelize, DataTypes) => {
  return sequelize.define("Categoria", {
    
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
      },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true
    }
  
  });
};