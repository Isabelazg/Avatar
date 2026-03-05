import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import avatarRoutes from './routes/avatarRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globales
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api', avatarRoutes);
app.use('/api', emailRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'Avatar Generator API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      generateAvatar: 'POST /api/avatar',
      sendEmail: 'POST /api/send-avatar-email'
    }
  });
});

// Manejo de errores
app.use(notFound);
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 Frontend URL configurada: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🔑 OpenAI API Key configurada: ${process.env.OPENAI_API_KEY ? '✅' : '❌'}`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
