import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import http from 'http';
import db  from './database/index.js'


// Importar rutas
import carritoRoutes from './routes/carritoRoute.js';
import itemRoutes from './routes/itemsRoute.js';
import authRoutes from './routes/authRoute.js';
import pedidosRoutes from './routes/pedidosRoute.js';

const force = false;  //reiniciar db
const alter = false; //aplicar cambios en estructura

// Cargar variables de entorno
dotenv.config();

const {sequelize} = db;

// Inicializar Express
const app = express();

//trae el puerto
const PORT = process.env.PORT || 3000;

if (process.env.CRONS_ENABLED) //config para incializar o no crons 
  iniciarCrons(); // iniciar cron jobs

// Configurar middlewares globales
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'nombreCafe'],
  credentials: true
})); // Permitir solicitudes desde otros dominios
app.use(helmet({
  contentSecurityPolicy: false,
})); // Seguridad para la API
app.use(morgan('dev')); // Logs de solicitudes HTTP en consola
app.use(express.json()); // Habilitar JSON en el body de las requests
app.use(express.urlencoded({ extended: true })); // Soporte para datos de formularios
// Servir imágenes directamente desde carpeta uploads
app.use('/uploads', express.static(path.join('/uploads')));
// app.use(passport.initialize());
//app.use('/imagenes', express.static(path.join(__dirname, 'imagenes'))); // Servir imágenes estáticas


// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
// app.use('/api/categorias', itemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pedidos', /*authMiddleware,*/ pedidosRoutes);
app.use('/api/carrito', /*authMiddleware,*/ carritoRoutes);


// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ message: 'Error interno del servidor', error: err.message });
});

// Inicializar el servidor de Express
const server = http.createServer(app);

// Sync the database (Apply model changes)
async function initializeDB() {
  await db.sequelize.sync({ force, alter }) //!sacar pq resetea todo a la mierda
    .then(() => console.log("✅ Database synced"))
    .catch(err => console.error("❌ Sync error:", err));
}

// Inicializar la base de datos
initializeDB();

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
