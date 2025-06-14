'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Pedidos', 'externalPedidoId', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'ID of the pedido in the external system'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Pedidos', 'externalPedidoId');
  }
}; 