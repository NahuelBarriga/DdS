// seeders/xxxxxx-demo-items.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Items', [
        // Electrónica
        { nombre: 'Smartphone', precio: 799.99, descripcion: 'Teléfono de última generación', categoriaId: 1, stock: true, tag: 'tech', imagenId: null, createdAt: new Date(), updatedAt: new Date() },
        { nombre: 'Auriculares Bluetooth', precio: 59.99, descripcion: 'Auriculares inalámbricos con cancelación de ruido', categoriaId: 1, stock: true, tag: 'audio', imagenId: null, createdAt: new Date(), updatedAt: new Date() },
        { nombre: 'Tablet 10"', precio: 299.99, descripcion: 'Pantalla grande y batería duradera', categoriaId: 1, stock: true, tag: 'tech', imagenId: null, createdAt: new Date(), updatedAt: new Date() },
        { nombre: 'Smartwatch', precio: 149.99, descripcion: 'Reloj inteligente con monitor de salud', categoriaId: 1, stock: true, tag: 'wearable', imagenId: null, createdAt: new Date(), updatedAt: new Date() },
      
        // Ropa
        { nombre: 'Remera básica', precio: 14.99, descripcion: '100% algodón', categoriaId: 2, stock: true, tag: 'verano', imagenId: null, createdAt: new Date(), updatedAt: new Date() },
        { nombre: 'Campera de invierno', precio: 89.99, descripcion: 'Abrigada y resistente al agua', categoriaId: 2, stock: true, tag: 'invierno', imagenId: null, createdAt: new Date(), updatedAt: new Date() },
        { nombre: 'Pantalón jean', precio: 39.99, descripcion: 'Diseño clásico y duradero', categoriaId: 2, stock: true, tag: 'ropa', imagenId: null, createdAt: new Date(), updatedAt: new Date() },
        { nombre: 'Zapatillas urbanas', precio: 64.99, descripcion: 'Cómodas para caminar todo el día', categoriaId: 2, stock: true, tag: 'calzado', imagenId: null, createdAt: new Date(), updatedAt: new Date() },
      
        // Hogar
        { nombre: 'Almohada viscoelástica', precio: 29.99, descripcion: 'Con memory foam', categoriaId: 3, stock: true, tag: 'descanso', imagenId: null, createdAt: new Date(), updatedAt: new Date() },
        { nombre: 'Set de sábanas', precio: 49.99, descripcion: 'Juego de cama para dos plazas', categoriaId: 3, stock: true, tag: 'hogar', imagenId: null, createdAt: new Date(), updatedAt: new Date() },
        { nombre: 'Lámpara de escritorio', precio: 22.99, descripcion: 'LED, ajustable y moderna', categoriaId: 3, stock: true, tag: 'iluminación', imagenId: null, createdAt: new Date(), updatedAt: new Date() },
      
        // Juguetes
        { nombre: 'Rompecabezas 1000 piezas', precio: 18.99, descripcion: 'Ideal para compartir en familia', categoriaId: 4, stock: true, tag: 'puzzle', imagenId: null, createdAt: new Date(), updatedAt: new Date() },
        { nombre: 'Auto a control remoto', precio: 34.99, descripcion: 'Velocidad y diversión asegurada', categoriaId: 4, stock: true, tag: 'juguetes', imagenId: null, createdAt: new Date(), updatedAt: new Date() },
        { nombre: 'Muñeca articulada', precio: 24.99, descripcion: 'Con accesorios incluidos', categoriaId: 4, stock: true, tag: 'niños', imagenId: null, createdAt: new Date(), updatedAt: new Date() }
      ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Items', null, {});
  }
};
