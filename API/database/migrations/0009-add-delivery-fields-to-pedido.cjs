'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Pedidos', 'nombreCliente', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Pedidos', 'direccionEntrega', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Pedidos', 'ciudad', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Pedidos', 'telefonoCliente', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('Pedidos', 'estado', {
      type: Sequelize.ENUM(
        'pendiente',
        'pagado',
        'confirmado',
        'rechazado',
        'listo para enviar',
        'entregado',
        'entrega cancelada'
      ),
      allowNull: false,
      defaultValue: 'pendiente',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Pedidos', 'nombreCliente');
    await queryInterface.removeColumn('Pedidos', 'direccionEntrega');
    await queryInterface.removeColumn('Pedidos', 'ciudad');
    await queryInterface.removeColumn('Pedidos', 'telefonoCliente');
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
  }
};