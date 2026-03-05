import express from 'express';
import { sendAvatarEmail } from '../controllers/emailController.js';

const router = express.Router();

/**
 * POST /api/send-avatar-email
 * Envía el avatar generado por correo electrónico
 */
router.post('/send-avatar-email', sendAvatarEmail);

export default router;
