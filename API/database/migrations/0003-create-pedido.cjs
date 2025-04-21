'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Pedidos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      clienteId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false
      },
      estado: {
        type: Sequelize.ENUM("pendiente", "confirmado", "rechazado", "finalizado", "pago pendiente"),
        allowNull: false,
        defaultValue: "pendiente"
      },
      total: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      subtotal: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      comentario: {
        type: Sequelize.STRING,
        allowNull: true
      },
      coupon: {
        type: Sequelize.STRING,
        allowNull: true
      },
      mesaId: {
        type: Sequelize.INTEGER,
        allowNull: false
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
    await queryInterface.dropTable('Pedidos');
  }
};
