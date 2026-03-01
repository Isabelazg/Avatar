/**
 * Construye el prompt dinámico para la generación del avatar
 * @param {Object} options - Opciones de personalización del avatar
 * @returns {string} Prompt completo para OpenAI
 */
export const buildAvatarPrompt = (options) => {
  const {
    skinTone = 'medio',
    hairType = 'corto',
    hairColor = 'castaño',
    accessory = 'ninguno',
    eyeColor = 'marrón'
  } = options;

  // Mapeo de valores en español a descripciones en inglés
  const skinToneMap = {
    'claro': 'light skin tone',
    'medio': 'medium skin tone',
    'oscuro': 'dark skin tone'
  };

  const hairTypeMap = {
    'corto': 'short hair',
    'largo': 'long hair',
    'rizado': 'curly hair',
    'ondulado': 'wavy hair'
  };

  const hairColorMap = {
    'negro': 'black hair',
    'castaño': 'brown hair',
    'rubio': 'blonde hair',
    'rojo': 'red hair',
    'gris': 'gray hair'
  };

  const accessoryMap = {
    'ninguno': '',
    'gafas': 'wearing stylish glasses',
    'audífonos': 'wearing modern headphones',
    'gorra': 'wearing a trendy cap'
  };

  const eyeColorMap = {
    'marrón': 'brown eyes',
    'azul': 'blue eyes',
    'verde': 'green eyes',
    'negro': 'black eyes',
    'avellana': 'hazel eyes'
  };

  // Construir el prompt
  const baseStyle = "Create a 3D cartoon avatar in Pixar/Disney style";
  const characteristics = [
    skinToneMap[skinTone] || 'medium skin tone',
    hairTypeMap[hairType] || 'short hair',
    hairColorMap[hairColor] || 'brown hair',
    eyeColorMap[eyeColor] || 'brown eyes'
  ];

  const accessoryText = accessoryMap[accessory];
  if (accessoryText) {
    characteristics.push(accessoryText);
  }

  const styleDetails = [
    "large expressive eyes",
    "soft studio lighting",
    "clean background",
    "hyper-detailed render",
    "smooth texture like modern animated character",
    "friendly and appealing expression",
    "professional character design"
  ];

  const prompt = `${baseStyle}. Character with ${characteristics.join(', ')}. ${styleDetails.join(', ')}. High quality, vibrant colors, cinematic lighting.`;

  return prompt;
};

/**
 * Valida las opciones del avatar
 * @param {Object} options - Opciones a validar
 * @returns {boolean} True si las opciones son válidas
 */
export const validateAvatarOptions = (options) => {
  const validSkinTones = ['claro', 'medio', 'oscuro'];
  const validHairTypes = ['corto', 'largo', 'rizado', 'ondulado'];
  const validHairColors = ['negro', 'castaño', 'rubio', 'rojo', 'gris'];
  const validAccessories = ['ninguno', 'gafas', 'audífonos', 'gorra'];
  const validEyeColors = ['marrón', 'azul', 'verde', 'negro', 'avellana'];

  if (options.skinTone && !validSkinTones.includes(options.skinTone)) {
    return false;
  }
  if (options.hairType && !validHairTypes.includes(options.hairType)) {
    return false;
  }
  if (options.hairColor && !validHairColors.includes(options.hairColor)) {
    return false;
  }
  if (options.accessory && !validAccessories.includes(options.accessory)) {
    return false;
  }
  if (options.eyeColor && !validEyeColors.includes(options.eyeColor)) {
    return false;
  }

  return true;
};
