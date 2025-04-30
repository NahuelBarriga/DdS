'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Pedidos', 'mesaId');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Pedidos', 'mesaId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  }
};