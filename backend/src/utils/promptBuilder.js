/**
 * Construye el prompt para análisis de imagen
 * @returns {string} Prompt de análisis que evita filtros de OpenAI
 */
export const buildAnalysisPrompt = () => {
  return `Describe the visual elements in this image for 3D character design:

Visual Elements:
- Hair: color tones, length (short/shoulder/long), texture pattern (straight/wavy/curly)
- Face: shape geometry, proportions
- Eyes: color, size relative to face
- Skin: tone (light/medium/tan/brown/dark), undertones
- Overall aesthetic: age appearance, style

Focus on observable visual characteristics only. Output concise technical description.`;
};

/**
 * Construye el prompt para generar avatar base desde descripción
 * @param {string} description - Descripción detallada del análisis
 * @returns {string} Prompt simplificado y seguro para OpenAI
 */
export const buildGenerationPrompt = (description) => {
  return `3D animated portrait with these exact characteristics:

${description}

Style: Soft 3D render, natural lighting, clean background. Match all features precisely. Single portrait, no text, no multiple views.`;
};

/**
 * Construye el prompt para editar un avatar existente
 * @param {string} originalDescription - Descripción del avatar original
 * @param {Object} modifications - Modificaciones solicitadas
 * @returns {string} Prompt de edición que preserva características originales
 */
export const buildEditPrompt = (originalDescription, modifications) => {
  const {
    hairColor,
    accessories,
    background,
    eyeColor
  } = modifications;

  const changes = [];

  if (hairColor) {
    const hairColorMap = {
      'negro': 'black',
      'castaño': 'brown',
      'rubio': 'blonde',
      'rojo': 'red',
      'gris': 'gray',
      'rosa': 'pink',
      'azul': 'blue',
      'verde': 'green',
      'morado': 'purple'
    };
    changes.push(`Change hair color to ${hairColorMap[hairColor] || hairColor}`);
  }

  if (accessories && accessories !== 'ninguno') {
    const accessoryMap = {
      'gafas': 'Add stylish glasses',
      'gafas_sol': 'Add trendy sunglasses',
      'audífonos': 'Add modern headphones',
      'gorra': 'Add a fashionable cap',
      'sombrero': 'Add a cool hat',
      'diadema': 'Add a headband',
      'aretes': 'Add earrings'
    };
    changes.push(accessoryMap[accessories] || `Add ${accessories}`);
  }

  if (background) {
    const backgroundMap = {
      'gradiente': 'Change background to a smooth gradient (purple to pink)',
      'espacio': 'Change background to outer space with stars',
      'naturaleza': 'Change background to a nature scene with trees',
      'ciudad': 'Change background to a city skyline',
      'abstracto': 'Change background to an abstract colorful pattern',
      'solido': 'Change background to a solid neutral color'
    };
    changes.push(backgroundMap[background] || `Change background to ${background}`);
  }

  if (eyeColor) {
    const eyeColorMap = {
      'marrón': 'brown',
      'azul': 'blue',
      'verde': 'green',
      'negro': 'black',
      'avellana': 'hazel',
      'gris': 'gray'
    };
    changes.push(`Change eye color to ${eyeColorMap[eyeColor] || eyeColor}`);
  }

  // Build prompt combining original description with modifications
  const prompt = [
    "3D cartoon avatar portrait with these exact features:",
    "",
    originalDescription,
    "",
    "Apply these modifications while preserving all other features:",
    ...changes.map(change => `- ${change}`)
  ].join('\n');

  return prompt;
};

/**
 * Valida las opciones de edición del avatar
 * @param {Object} modifications - Modificaciones a validar
 * @returns {boolean} True si las opciones son válidas
 */
export const validateEditOptions = (modifications) => {
  const validHairColors = ['negro', 'castaño', 'rubio', 'rojo', 'gris', 'rosa', 'azul', 'verde', 'morado'];
  const validAccessories = ['ninguno', 'gafas', 'gafas_sol', 'audífonos', 'gorra', 'sombrero', 'diadema', 'aretes'];
  const validBackgrounds = ['gradiente', 'espacio', 'naturaleza', 'ciudad', 'abstracto', 'solido'];
  const validEyeColors = ['marrón', 'azul', 'verde', 'negro', 'avellana', 'gris'];

  if (modifications.hairColor && !validHairColors.includes(modifications.hairColor)) {
    return false;
  }
  if (modifications.accessories && !validAccessories.includes(modifications.accessories)) {
    return false;
  }
  if (modifications.background && !validBackgrounds.includes(modifications.background)) {
    return false;
  }
  if (modifications.eyeColor && !validEyeColors.includes(modifications.eyeColor)) {
    return false;
  }

  return true;
};
