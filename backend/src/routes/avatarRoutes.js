import express from 'express';
import { generateAvatarController, editAvatarController, healthCheckController } from '../controllers/avatarController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Ruta de health check
router.get('/health', healthCheckController);

// FASE 1: Generar avatar base (análisis + generación)
router.post('/avatar/generate', upload.single('image'), generateAvatarController);

// FASE 2: Editar avatar existente
router.post('/avatar/edit', editAvatarController);

export default router;
