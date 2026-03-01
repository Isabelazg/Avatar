import { generateAvatar } from '../services/openaiService.js';
import { imageToBase64, validateImageFile, deleteFile } from '../services/imageService.js';
import { validateAvatarOptions } from '../utils/promptBuilder.js';

/**
 * Controlador para generar avatar
 */
export const generateAvatarController = async (req, res, next) => {
  let filePath = null;

  try {
    // Validar que se subió un archivo
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No se proporcionó ninguna imagen'
      });
    }

    filePath = req.file.path;

    // Validar el archivo
    validateImageFile(req.file);

    // Obtener opciones del body
    const options = {
      skinTone: req.body.skinTone || 'medio',
      hairType: req.body.hairType || 'corto',
      hairColor: req.body.hairColor || 'castaño',
      accessory: req.body.accessory || 'ninguno',
      eyeColor: req.body.eyeColor || 'marrón'
    };

    console.log('Opciones recibidas:', options);

    // Validar opciones
    if (!validateAvatarOptions(options)) {
      return res.status(400).json({
        success: false,
        error: 'Opciones de avatar inválidas'
      });
    }

    // Convertir imagen a base64
    const imageBase64 = await imageToBase64(filePath);

    // Generar avatar con OpenAI
    const result = await generateAvatar(imageBase64, options);

    // Eliminar archivo temporal
    await deleteFile(filePath);

    // Enviar respuesta exitosa
    res.status(200).json({
      success: true,
      data: {
        image: result.image,
        prompt: result.revisedPrompt
      }
    });

  } catch (error) {
    // Eliminar archivo temporal en caso de error
    if (filePath) {
      await deleteFile(filePath);
    }

    console.error('Error en generateAvatarController:', error);
    next(error);
  }
};

/**
 * Controlador para verificar el estado del servicio
 */
export const healthCheckController = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Avatar Generator API está funcionando correctamente',
    timestamp: new Date().toISOString()
  });
};
