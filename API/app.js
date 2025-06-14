import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import http from 'http';
import db  from './database/index.js'
import cors from 'cors'
import rabbitmqService from './services/rabbitmq.service.js';
import pedidoService from './services/pedidoService.js';

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

//trae el puerto, por si no era obvio 
const PORT = process.env.PORT || 3000;

// Configurar middlewares globales
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'nombreCafe'],
  credentials: true
}));
app.use(helmet({
  contentSecurityPolicy: false,
})); // Seguridad para la API
app.use(morgan('dev')); // Logs de solicitudes HTTP en consola
app.use(express.json()); // Habilitar JSON en el body de las requests
app.use(express.urlencoded({ extended: true })); // Soporte para datos de formularios


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

// Initialize RabbitMQ and start consuming messages
async function initializeRabbitMQ() {
  try {
    await rabbitmqService.connect();
    
    // Example message handler
    await rabbitmqService.consume(async (message) => {
        console.log("Received message", message)
        if (message.type === 'status_update') {
            await pedidoService.handleStatusUpdate(message);
        }
    });
    
    console.log("✅ RabbitMQ initialized and consuming messages");
  } catch (error) {
    console.error("❌ RabbitMQ initialization error:", error);
  }
}

// Initialize services
async function initializeServices() {
  await initializeDB();
  await initializeRabbitMQ();
}

// Initialize all services
initializeServices();

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received. Closing RabbitMQ connection...');
  await rabbitmqService.close();
  process.exit(0);
});

export default app;
