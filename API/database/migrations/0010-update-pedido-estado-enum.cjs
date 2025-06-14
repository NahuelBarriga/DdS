'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First remove the default value
    await queryInterface.changeColumn('Pedidos', 'estado', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: null
    });

    // Then update to the new enum without default
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
      allowNull: false
    });

    // Finally add the default value back
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
  },

  async down(queryInterface, Sequelize) {
    // Remove default value
    await queryInterface.changeColumn('Pedidos', 'estado', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: null
    });

    // Change to original enum without default
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
      allowNull: false
    });

    // Add default value back
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
      defaultValue: 'pendiente'
    });
  }
}; 