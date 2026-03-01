import fs from 'fs/promises';
import { existsSync } from 'fs';

/**
 * Convierte una imagen a base64
 * @param {string} imagePath - Ruta de la imagen
 * @returns {Promise<string>} Imagen en formato base64
 */
export const imageToBase64 = async (imagePath) => {
  try {
    const imageBuffer = await fs.readFile(imagePath);
    return imageBuffer.toString('base64');
  } catch (error) {
    throw new Error(`Error al convertir imagen a base64: ${error.message}`);
  }
};

/**
 * Valida el tipo de archivo
 * @param {Object} file - Archivo de multer
 * @returns {boolean} True si el archivo es válido
 */
export const validateImageFile = (file) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!file) {
    throw new Error('No se proporcionó ningún archivo');
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error('Tipo de archivo no permitido. Solo se aceptan: JPEG, PNG, WEBP');
  }

  if (file.size > maxSize) {
    throw new Error('El archivo es demasiado grande. Tamaño máximo: 10MB');
  }

  return true;
};

/**
 * Elimina un archivo temporal
 * @param {string} filePath - Ruta del archivo a eliminar
 */
export const deleteFile = async (filePath) => {
  try {
    if (existsSync(filePath)) {
      await fs.unlink(filePath);
      console.log(`Archivo temporal eliminado: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error al eliminar archivo: ${error.message}`);
  }
};

/**
 * Convierte base64 a buffer
 * @param {string} base64String - String en base64
 * @returns {Buffer} Buffer de la imagen
 */
export const base64ToBuffer = (base64String) => {
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  return Buffer.from(base64Data, 'base64');
};
