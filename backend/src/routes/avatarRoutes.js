import express from 'express';
import { generateAvatarController, healthCheckController } from '../controllers/avatarController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Ruta de health check
router.get('/health', healthCheckController);

// Ruta para generar avatar
router.post('/avatar', upload.single('image'), generateAvatarController);

export default router;
