
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


import UserModel from './models/user.js';
import EmpleadoModel from './models/empleado.js';
import ItemModel from './models/item.js';
import FotoModel from './models/foto.js';
import CategoriaModel from './models/categoria.js';
import PedidoModel from './models/pedido.js';
import ReservaModel from './models/reserva.js';
import MesaModel from './models/mesa.js';
import FormaModel from './models/forma.js';
import CajaModel from './models/caja.js';
import PedidoItemModel from './models/pedidoitem.js'

const User = UserModel(sequelize, DataTypes);
// const Empleado = EmpleadoModel(sequelize, DataTypes);
const Item = ItemModel(sequelize, DataTypes);
const Foto = FotoModel(sequelize, DataTypes);
const Categoria = CategoriaModel(sequelize, DataTypes);
const Pedido = PedidoModel(sequelize, DataTypes);
const Reserva = ReservaModel(sequelize, DataTypes);
const Mesa = MesaModel(sequelize, DataTypes);
const Forma = FormaModel(sequelize, DataTypes);
const Caja = CajaModel(sequelize, DataTypes);
const PedidoItem = PedidoItemModel(sequelize, DataTypes);



// Relaciones Cliente-Pedido (como cliente)
User.hasMany(Pedido, {
  foreignKey: {
    name: 'clienteId',
    onDelete: 'CASCADE'
  },
  as: 'pedidosComoCliente'
});

Pedido.belongsTo(User, {
  foreignKey: {
    name: 'clienteId',
    onDelete: 'CASCADE'
  },
  as: 'cliente'
});

// Pedido.belongsTo(Empleado, { //todo: ver esto porque el empleado solo aprueba el pedido en realidad
//   foreignKey: {
//     name: 'empleadoId'
//   },
//   as: 'empleado'
// });

// Relaciones Cliente-Reserva
User.hasMany(Reserva, { 
  foreignKey: {
    name: 'clienteId',
    onDelete: 'CASCADE'
  },
  as: 'reservas'
});

Reserva.belongsTo(User, { 
  foreignKey: {
    name: 'clienteId',
    onDelete: 'CASCADE'
  },
  as: 'cliente'
});

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

// Relaciones Mesa-Pedido
Mesa.hasMany(Pedido, { 
  foreignKey: {
    name: 'mesaId',
    onDelete: 'CASCADE'
  },
  as: 'pedidos'
});

Pedido.belongsTo(Mesa, { 
  foreignKey: {
    name: 'mesaId',
    onDelete: 'CASCADE'
  },
  as: 'mesa'
});

// Relaciones Mesa-Reserva
Mesa.hasMany(Reserva, { 
  foreignKey: {
    name: 'mesaId',
    onDelete: 'CASCADE'
  },
  as: 'reservas'
});

Reserva.belongsTo(Mesa, { 
  foreignKey: {
    name: 'mesaId',
    onDelete: 'CASCADE'
  },
  as: 'mesa'
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

// Relaciones Item-Foto
Foto.hasOne(Item, {
  foreignKey: {
    name: 'fotoId'
  },
  as: 'item'
});

Item.belongsTo(Foto, {
  foreignKey: {
    name: 'fotoId'
  },
  as: 'foto'
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = User;
// db.Empleado = Empleado;
db.Item = Item;
db.Foto = Foto;
db.Categoria = Categoria;
db.PedidoItem = PedidoItem;
db.Pedido = Pedido;
db.Reserva = Reserva;
db.Mesa = Mesa;
db.Forma = Forma;
db.Caja = Caja;

export default db;
