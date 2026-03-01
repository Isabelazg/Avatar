import { API_BASE_URL } from '../utils/constants';

/**
 * Genera un avatar usando el backend
 * @param {File} imageFile - Archivo de imagen
 * @param {Object} options - Opciones de personalización
 * @returns {Promise<Object>} Resultado con la imagen generada
 */
export const generateAvatar = async (imageFile, options) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('skinTone', options.skinTone);
    formData.append('hairType', options.hairType);
    formData.append('hairColor', options.hairColor);
    formData.append('accessory', options.accessory);
    formData.append('eyeColor', options.eyeColor);

    const response = await fetch(`${API_BASE_URL}/avatar`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al generar avatar');
    }

    return data;
  } catch (error) {
    console.error('Error en avatarService:', error);
    throw error;
  }
};

/**
 * Verifica el estado del servicio
 * @returns {Promise<Object>} Estado del servicio
 */
export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al verificar salud del servicio:', error);
    throw error;
  }
};
