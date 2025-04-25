'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categorias', [
      { id: 1, nombre: 'Alimentos', descripcion: 'Comida para perros, gatos y otras mascotas', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, nombre: 'Juguetes', descripcion: 'Diversión y entretenimiento para mascotas', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, nombre: 'Accesorios', descripcion: 'Correas, camas, comederos y más', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, nombre: 'Salud e Higiene', descripcion: 'Productos para el cuidado de la salud y limpieza', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categorias', null, {});
  }
};
