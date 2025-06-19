'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Convert estado column from ENUM to STRING
    await queryInterface.changeColumn('Pedidos', 'estado', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'pendiente'
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert back to ENUM type
    await queryInterface.changeColumn('Pedidos', 'estado', {
      type: Sequelize.ENUM(
        'pendiente',
        'confirmado',
        'rechazado',
        'finalizado',
        'pago pendiente',
        'pagado',
        'enviado',
        'entregado',
        'Confirmado',
        'Listo para enviar',
        'Entregado',
        'Entrega cancelada'
      ),
      allowNull: false,
      defaultValue: 'pendiente'
    });
  }
}; 