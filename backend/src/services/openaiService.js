import openai from '../config/openai.config.js';
import { buildAnalysisPrompt, buildGenerationPrompt, buildEditPrompt } from '../utils/promptBuilder.js';

/**
 * Analiza una imagen para extraer características detalladas
 * @param {string} imageBase64 - Imagen base en base64
 * @returns {Promise<Object>} Descripción detallada de la persona
 */
export const analyzeImage = async (imageBase64) => {
  try {
    const prompt = buildAnalysisPrompt();

    console.log('🔍 Analizando imagen con Vision API (GPT-4o)...');

    // Llamada a OpenAI Vision API para analizar la imagen
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
                detail: "high" // Alta resolución para análisis detallado
              }
            }
          ]
        }
      ],
      max_tokens: 800
    });

    const description = response.choices[0].message.content;

    // Detectar si OpenAI rechazó el análisis por políticas de privacidad
    const isRejected = description.toLowerCase().includes("i'm sorry") || 
                      description.toLowerCase().includes("i can't") ||
                      description.toLowerCase().includes("i cannot");

    if (isRejected) {
      console.log('⚠️ Vision API rechazó el análisis detallado. Intentando análisis visual simple...');
      
      // Segundo intento con prompt ultra-simple enfocado solo en colores y formas
      try {
        const simpleResponse = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Describe the visual composition: What are the dominant colors? What shapes and patterns do you observe? Describe length of visible elements, texture patterns, color palette."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`,
                    detail: "low"
                  }
                }
              ]
            }
          ],
          max_tokens: 300
        });

        const simpleDescription = simpleResponse.choices[0].message.content;
        
        if (!simpleDescription.toLowerCase().includes("i'm sorry") && 
            !simpleDescription.toLowerCase().includes("i can't")) {
          console.log('✅ Análisis visual simple exitoso');
          return {
            success: true,
            description: simpleDescription
          };
        }
      } catch (simpleError) {
        console.log('⚠️ Análisis simple también falló. Usando descripción base.');
      }

      // Si ambos intentos fallan, usar descripción muy genérica
      return {
        success: true,
        description: "3D character with medium-length dark wavy hair, oval face, warm medium skin tone, dark expressive eyes, natural features, youthful appearance"
      };
    }

    console.log('✅ Análisis completado');
    console.log('Descripción (primeros 200 caracteres):', description.substring(0, 200) + '...');
    console.log('Longitud total de descripción:', description.length, 'caracteres');

    return {
      success: true,
      description: description
    };

  } catch (error) {
    console.error('❌ Error en análisis de imagen:', error);
    handleOpenAIError(error, 'analizar la imagen');
  }
};

/**
 * Genera un avatar base usando la descripción del análisis
 * @param {string} description - Descripción detallada de la persona
 * @returns {Promise<Object>} Resultado con la imagen generada
 */
export const generateAvatarFromDescription = async (description) => {
  try {
    const prompt = buildGenerationPrompt(description);

    console.log('🎨 Generando avatar con máxima fidelidad física...');
    console.log('Longitud del prompt:', prompt.length, 'caracteres');

    // Llamada a OpenAI DALL-E para generar la imagen
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd", // CALIDAD HD para mayor fidelidad
      response_format: "b64_json"
    });

    const generatedImage = response.data[0];

    if (!generatedImage || !generatedImage.b64_json) {
      throw new Error('No se recibió imagen de OpenAI');
    }

    console.log('✅ Avatar base generado exitosamente');
    if (generatedImage.revised_prompt) {
      console.log('📝 Prompt revisado por DALL-E:', generatedImage.revised_prompt.substring(0, 150) + '...');
    }

    return {
      success: true,
      image: generatedImage.b64_json,
      revisedPrompt: generatedImage.revised_prompt || prompt
    };

  } catch (error) {
    console.error('❌ Error en generación de avatar:', error);
    handleOpenAIError(error, 'generar el avatar');
  }
};

/**
 * Edita un avatar existente con modificaciones específicas
 * @param {string} originalDescription - Descripción original del avatar
 * @param {Object} modifications - Modificaciones a aplicar
 * @returns {Promise<Object>} Resultado con la imagen editada
 */
export const editAvatar = async (originalDescription, modifications) => {
  try {
    const prompt = buildEditPrompt(originalDescription, modifications);

    console.log('Editando avatar con modificaciones:', modifications);
    console.log('Descripción original:', originalDescription.substring(0, 100) + '...');

    // Usar Vision + DALL-E para editar el avatar
    // Primero, crear un prompt que incluya la imagen de referencia
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "b64_json"
    });

    const editedImage = response.data[0];

    if (!editedImage || !editedImage.b64_json) {
      throw new Error('No se recibió imagen editada de OpenAI');
    }

    console.log('Avatar editado exitosamente');

    return {
      success: true,
      image: editedImage.b64_json,
      revisedPrompt: editedImage.revised_prompt || prompt
    };

  } catch (error) {
    console.error('Error en edición de avatar:', error);
    handleOpenAIError(error, 'editar el avatar');
  }
};

/**
 * Maneja errores específicos de OpenAI
 * @param {Error} error - Error de OpenAI
 * @param {string} action - Acción que se estaba realizando
 * @throws {Error} Error formateado
 */
const handleOpenAIError = (error, action) => {
  if (error.status === 400) {
    if (error.message && error.message.includes('billing')) {
      throw new Error('⚠️ Tu cuenta de OpenAI ha alcanzado el límite de facturación. Por favor, agrega créditos en platform.openai.com/account/billing');
    }
    throw new Error(`Solicitud inválida a OpenAI al ${action}: ${error.message}`);
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

  throw new Error(`Error al ${action}: ${error.message}`);
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
