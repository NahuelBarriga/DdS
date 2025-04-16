
import { Sequelize, DataTypes } from '@sequelize/core';
import process from 'process';
const env = process.env.NODE_ENV || 'development';
import config from '../config/config.json' with { type: "json" };
const db = {};
const envConfig = config[env]


const sequelize = new Sequelize({
  database: config.development.database, 
  user: config.development.username, 
  password: config.development.password,
  host: config.development.host,
  dialect: "postgres",
  timezone: 'America/Argentina/Buenos_Aires',
  // dialectOptions: {
  //   useUTC: false, 
  // },
  logging: false,  // Disable SQL logging
});


import ItemModel from './models/item.js';
import CategoriaModel from './models/categoria.js';
import PedidoModel from './models/pedido.js';
import PedidoItemModel from './models/pedidoitem.js'

// const Empleado = EmpleadoModel(sequelize, DataTypes);
const Item = ItemModel(sequelize, DataTypes);
const Categoria = CategoriaModel(sequelize, DataTypes);
const Pedido = PedidoModel(sequelize, DataTypes);
const PedidoItem = PedidoItemModel(sequelize, DataTypes);



// Relaciones Pedido-Item
Pedido.belongsToMany(Item, {
  through: PedidoItem,
  foreignKey: {
    name: 'pedidoId',
    onDelete: 'CASCADE'
  },
  otherKey: {
    name: 'itemId'
  },
  as: 'items'
});

Item.belongsToMany(Pedido, {
  through: PedidoItem,
  foreignKey: {
    name: 'itemId',
  },
  otherKey: {
    name: 'pedidoId',
    onDelete: 'CASCADE'
  },
  as: 'pedidos'
});

// Relaciones Item-Categoria
Categoria.hasMany(Item, {
  foreignKey: {
    name: 'categoriaId'
  },
  as: 'items'
});

Item.belongsTo(Categoria, {
  foreignKey: {
    name: 'categoriaId'
  },
  as: 'categoria'
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Item = Item;
db.Categoria = Categoria;
db.PedidoItem = PedidoItem;
db.Pedido = Pedido;

export default db;
