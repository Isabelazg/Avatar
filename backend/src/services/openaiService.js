import openai from '../config/openai.config.js';
import { buildAvatarPrompt } from '../utils/promptBuilder.js';

/**
 * Genera un avatar usando OpenAI DALL-E
 * @param {string} imageBase64 - Imagen base en base64
 * @param {Object} options - Opciones de personalización
 * @returns {Promise<Object>} Resultado con la imagen generada
 */
export const generateAvatar = async (imageBase64, options) => {
  try {
    // Construir el prompt dinámico
    const prompt = buildAvatarPrompt(options);

    console.log('Generando avatar con prompt:', prompt);

    // Llamada a OpenAI para generar la imagen
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "b64_json"
    });

    // Extraer la imagen generada
    const generatedImage = response.data[0];

    if (!generatedImage || !generatedImage.b64_json) {
      throw new Error('No se recibió imagen de OpenAI');
    }

    return {
      success: true,
      image: generatedImage.b64_json,
      revisedPrompt: generatedImage.revised_prompt || prompt
    };

  } catch (error) {
    console.error('Error en OpenAI Service:', error);
    
    // Manejo de errores específicos de OpenAI
    if (error.status === 400) {
      if (error.message && error.message.includes('billing')) {
        throw new Error('⚠️ Tu cuenta de OpenAI ha alcanzado el límite de facturación. Por favor, agrega créditos en platform.openai.com/account/billing');
      }
      throw new Error('Solicitud inválida a OpenAI: ' + error.message);
    }
    if (error.status === 401) {
      throw new Error('API Key de OpenAI inválida o no configurada');
    }
    if (error.status === 429) {
      throw new Error('Límite de uso alcanzado. Intenta de nuevo en unos minutos');
    }
    if (error.status === 500) {
      throw new Error('Error en el servidor de OpenAI. Intenta más tarde');
    }

    throw new Error(`Error al generar avatar: ${error.message}`);
  }
};

/**
 * Verifica la configuración de OpenAI
 * @returns {Promise<boolean>} True si la configuración es válida
 */
export const verifyOpenAIConfig = async () => {
  try {
    await openai.models.list();
    return true;
  } catch (error) {
    console.error('Error al verificar configuración de OpenAI:', error.message);
    return false;
  }
};
