import { analyzeImage, generateAvatarFromDescription, editAvatar } from '../services/openaiService.js';
import { imageToBase64, validateImageFile, deleteFile } from '../services/imageService.js';
import { validateEditOptions } from '../utils/promptBuilder.js';

/**
 * Controlador para generar avatar base
 * FASE 1: Análisis + Generación
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

    console.log('📸 Iniciando generación de avatar con MÁXIMA FIDELIDAD FÍSICA...');
    console.log('Archivo:', req.file.originalname, '|', (req.file.size / 1024).toFixed(2), 'KB');

    // PASO 1: Convertir imagen a base64
    const imageBase64 = await imageToBase64(filePath);

    // PASO 2: Analizar imagen con OpenAI Vision (análisis estructurado y detallado)
    console.log('🔍 PASO 1/2: Analizando características físicas detalladas...');
    const analysisResult = await analyzeImage(imageBase64);

    // PASO 3: Generar avatar base usando la descripción (prioridad: fidelidad > estilo)
    console.log('🎨 PASO 2/2: Generando avatar preservando rasgos exactos...');
    const generationResult = await generateAvatarFromDescription(analysisResult.description);

    // Eliminar archivo temporal
    await deleteFile(filePath);

    console.log('✅ Avatar base generado exitosamente');

    // Enviar respuesta exitosa
    res.status(200).json({
      success: true,
      data: {
        avatar: generationResult.image,
        description: analysisResult.description,
        prompt: generationResult.revisedPrompt
      }
    });

  } catch (error) {
    // Eliminar archivo temporal en caso de error
    if (filePath) {
      await deleteFile(filePath);
    }

    console.error('❌ Error en generateAvatarController:', error);
    next(error);
  }
};

/**
 * Controlador para editar avatar existente
 * FASE 2: Edición posterior
 */
export const editAvatarController = async (req, res, next) => {
  try {
    // Obtener descripción original y modificaciones del body
    const { originalDescription, modifications } = req.body;

    // Validar que se proporcionó la descripción original
    if (!originalDescription) {
      return res.status(400).json({
        success: false,
        error: 'No se proporcionó la descripción original del avatar'
      });
    }

    // Validar que se proporcionaron modificaciones
    if (!modifications || Object.keys(modifications).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No se proporcionaron modificaciones'
      });
    }

    // Validar opciones de edición
    if (!validateEditOptions(modifications)) {
      return res.status(400).json({
        success: false,
        error: 'Opciones de edición inválidas'
      });
    }

    console.log('✏️ Iniciando edición de avatar...');
    console.log('Modificaciones:', modifications);

    // Editar avatar
    const editResult = await editAvatar(originalDescription, modifications);

    console.log('✅ Avatar editado exitosamente');

    // Enviar respuesta exitosa
    res.status(200).json({
      success: true,
      data: {
        avatar: editResult.image,
        prompt: editResult.revisedPrompt
      }
    });

  } catch (error) {
    console.error('❌ Error en editAvatarController:', error);
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
