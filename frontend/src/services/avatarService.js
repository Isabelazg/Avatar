import { API_BASE_URL } from '../utils/constants';

/**
 * Genera un avatar base usando análisis + generación
 * @param {File} imageFile - Archivo de imagen
 * @returns {Promise<Object>} Resultado con avatar, descripción y prompt
 */
export const generateAvatar = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${API_BASE_URL}/avatar/generate`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al generar avatar');
    }

    return data;
  } catch (error) {
    console.error('Error en generateAvatar:', error);
    throw error;
  }
};

/**
 * Edita un avatar existente con modificaciones
 * @param {string} originalDescription - Descripción original del avatar
 * @param {Object} modifications - Modificaciones a aplicar
 * @returns {Promise<Object>} Resultado con avatar editado
 */
export const editAvatar = async (originalDescription, modifications) => {
  try {
    const response = await fetch(`${API_BASE_URL}/avatar/edit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        originalDescription,
        modifications
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al editar avatar');
    }

    return data;
  } catch (error) {
    console.error('Error en editAvatar:', error);
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
