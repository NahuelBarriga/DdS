module.exports = {
    async up(queryInterface, Sequelize) {
      await queryInterface.bulkInsert('Categorias', 
        [
            { id: 1, nombre: 'Electrónica', descripcion: 'Tecnología, gadgets y accesorios', createdAt: new Date(), updatedAt: new Date() },
            { id: 2, nombre: 'Ropa', descripcion: 'Indumentaria para todas las estaciones', createdAt: new Date(), updatedAt: new Date() },
            { id: 3, nombre: 'Hogar', descripcion: 'Artículos y decoración para el hogar', createdAt: new Date(), updatedAt: new Date() },
            { id: 4, nombre: 'Juguetes', descripcion: 'Diversión para todas las edades', createdAt: new Date(), updatedAt: new Date() }
        ]);
    },
    async down(queryInterface, Sequelize) {
      await queryInterface.bulkDelete('Categorias', null, {});
    }
  };