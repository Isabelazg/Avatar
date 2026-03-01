export const AVATAR_OPTIONS = {
  skinTone: [
    { value: 'claro', label: 'Claro' },
    { value: 'medio', label: 'Medio' },
    { value: 'oscuro', label: 'Oscuro' }
  ],
  hairType: [
    { value: 'corto', label: 'Corto' },
    { value: 'largo', label: 'Largo' },
    { value: 'rizado', label: 'Rizado' },
    { value: 'ondulado', label: 'Ondulado' }
  ],
  hairColor: [
    { value: 'negro', label: 'Negro' },
    { value: 'castaño', label: 'Castaño' },
    { value: 'rubio', label: 'Rubio' },
    { value: 'rojo', label: 'Rojo' },
    { value: 'gris', label: 'Gris' }
  ],
  accessory: [
    { value: 'ninguno', label: 'Ninguno' },
    { value: 'gafas', label: 'Gafas' },
    { value: 'audífonos', label: 'Audífonos' },
    { value: 'gorra', label: 'Gorra' }
  ],
  eyeColor: [
    { value: 'marrón', label: 'Marrón' },
    { value: 'azul', label: 'Azul' },
    { value: 'verde', label: 'Verde' },
    { value: 'negro', label: 'Negro' },
    { value: 'avellana', label: 'Avellana' }
  ]
};

export const API_BASE_URL = 'http://localhost:5000/api';

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
