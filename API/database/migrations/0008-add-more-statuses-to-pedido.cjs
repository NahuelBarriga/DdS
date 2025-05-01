'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Pedidos', 'estado', {
      type: Sequelize.ENUM(
        'pendiente',
        'confirmado',
        'rechazado',
        'finalizado',
        'pago pendiente',
        'pagado',
        'enviado',
        'entregado'
      ),
      allowNull: false,
      defaultValue: 'pendiente',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Pedidos', 'estado', {
      type: Sequelize.ENUM(
        'pendiente',
        'confirmado',
        'rechazado',
        'finalizado',
        'pago pendiente'
      ),
      allowNull: false,
      defaultValue: 'pendiente',
    });
  },
};