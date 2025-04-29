export default (sequelize, DataTypes) => {
  return sequelize.define("Categoria", {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
      },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    }
  },
  {
    tableName: 'Categorias',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });
};