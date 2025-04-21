'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      precio: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      descripcion: {
        type: Sequelize.STRING,
        allowNull: true
      },
      categoriaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Categorias',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      stock: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      tag: {
        type: Sequelize.STRING,
        allowNull: true
      },
      imagenId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Items');
  }
};
