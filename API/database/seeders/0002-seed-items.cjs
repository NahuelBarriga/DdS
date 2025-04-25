'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Items', [
      // Alimentos
      { nombre: 'Alimento seco para perro', precio: 45.99, descripcion: 'Bolsa de 15kg para razas medianas', categoriaId: 1, stock: true, tag: 'perros', imagenId: null, createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Alimento húmedo para gato', precio: 2.99, descripcion: 'Lata de 150g con sabor a pollo', categoriaId: 1, stock: true, tag: 'gatos', imagenId: null, createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Snack dental para perros', precio: 5.49, descripcion: 'Ayuda a mantener dientes limpios', categoriaId: 1, stock: true, tag: 'snack', imagenId: null, createdAt: new Date(), updatedAt: new Date() },

      // Juguetes
      { nombre: 'Pelota con sonido', precio: 3.99, descripcion: 'Ideal para perros pequeños y medianos', categoriaId: 2, stock: true, tag: 'juguetes', imagenId: null, createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Ratón de peluche', precio: 1.99, descripcion: 'Juguete suave para gatos', categoriaId: 2, stock: true, tag: 'gatos', imagenId: null, createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Cuerda trenzada', precio: 6.50, descripcion: 'Juguete resistente para morder', categoriaId: 2, stock: true, tag: 'perros', imagenId: null, createdAt: new Date(), updatedAt: new Date() },

      // Accesorios
      { nombre: 'Cama acolchada para mascotas', precio: 39.99, descripcion: 'Suave y lavable, tamaño grande', categoriaId: 3, stock: true, tag: 'hogar', imagenId: null, createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Correa extensible', precio: 14.99, descripcion: 'Hasta 5 metros de largo', categoriaId: 3, stock: true, tag: 'paseo', imagenId: null, createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Comedero doble de acero', precio: 12.99, descripcion: 'Dos compartimientos para comida y agua', categoriaId: 3, stock: true, tag: 'accesorios', imagenId: null, createdAt: new Date(), updatedAt: new Date() },

      // Salud e Higiene
      { nombre: 'Shampoo antipulgas', precio: 9.99, descripcion: 'Apto para perros y gatos', categoriaId: 4, stock: true, tag: 'higiene', imagenId: null, createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Cepillo para pelaje', precio: 7.49, descripcion: 'Elimina el pelo suelto y masajea la piel', categoriaId: 4, stock: true, tag: 'cuidado', imagenId: null, createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Pastillas antiparasitarias', precio: 19.99, descripcion: 'Previene parásitos internos', categoriaId: 4, stock: true, tag: 'salud', imagenId: null, createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Items', null, {});
  }
};
