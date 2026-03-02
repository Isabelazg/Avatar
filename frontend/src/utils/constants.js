// Opciones de edición para la FASE 2
export const EDIT_OPTIONS = {
  hairColor: [
    { value: 'negro', label: '⚫ Negro' },
    { value: 'castaño', label: '🟤 Castaño' },
    { value: 'rubio', label: '🟡 Rubio' },
    { value: 'rojo', label: '🔴 Rojo' },
    { value: 'gris', label: '⚪ Gris' },
    { value: 'rosa', label: '🌸 Rosa' },
    { value: 'azul', label: '💙 Azul' },
    { value: 'verde', label: '💚 Verde' },
    { value: 'morado', label: '💜 Morado' }
  ],
  accessories: [
    { value: 'ninguno', label: 'Sin cambios' },
    { value: 'gafas', label: '👓 Gafas' },
    { value: 'gafas_sol', label: '🕶️ Gafas de sol' },
    { value: 'audífonos', label: '🎧 Audífonos' },
    { value: 'gorra', label: '🧢 Gorra' },
    { value: 'sombrero', label: '🎩 Sombrero' },
    { value: 'diadema', label: '👑 Diadema' },
    { value: 'aretes', label: '💎 Aretes' }
  ],
  background: [
    { value: 'gradiente', label: '🌈 Gradiente' },
    { value: 'espacio', label: '🌌 Espacio' },
    { value: 'naturaleza', label: '🌿 Naturaleza' },
    { value: 'ciudad', label: '🏙️ Ciudad' },
    { value: 'abstracto', label: '🎨 Abstracto' },
    { value: 'solido', label: '⬜ Sólido' }
  ],
  eyeColor: [
    { value: 'marrón', label: '🟤 Marrón' },
    { value: 'azul', label: '💙 Azul' },
    { value: 'verde', label: '💚 Verde' },
    { value: 'negro', label: '⚫ Negro' },
    { value: 'avellana', label: '🟫 Avellana' },
    { value: 'gris', label: '⚪ Gris' }
  ]
};

export const API_BASE_URL = 'http://localhost:5000/api';

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
