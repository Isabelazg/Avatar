import multer from 'multer';

/**
 * Middleware para manejo centralizado de errores
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Error de Multer
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'El archivo es demasiado grande. Tamaño máximo: 10MB'
      });
    }
    return res.status(400).json({
      success: false,
      error: `Error al subir archivo: ${err.message}`
    });
  }

  // Error de validación
  if (err.message.includes('no permitido') || err.message.includes('No se proporcionó')) {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }

  // Error de OpenAI
  if (err.message.includes('OpenAI') || err.message.includes('API Key')) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }

  // Error genérico
  res.status(500).json({
    success: false,
    error: err.message || 'Error interno del servidor'
  });
};

/**
 * Manejo de rutas no encontradas
 */
export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada'
  });
};
