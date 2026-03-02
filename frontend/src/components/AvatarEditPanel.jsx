import { useState } from 'react';
import { EDIT_OPTIONS } from '../utils/constants';
import CustomSelect from './CustomSelect';

const AvatarEditPanel = ({ onApplyChanges, isLoading }) => {
  const [modifications, setModifications] = useState({
    hairColor: null,
    accessories: null,
    background: null,
    eyeColor: null
  });

  const handleChange = (field, value) => {
    setModifications({
      ...modifications,
      [field]: value === 'ninguno' ? null : value
    });
  };

  const handleApply = () => {
    // Filtrar solo las modificaciones que no son null
    const activeModifications = Object.entries(modifications)
      .filter(([_, value]) => value !== null)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    if (Object.keys(activeModifications).length === 0) {
      alert('Selecciona al menos una modificación');
      return;
    }

    onApplyChanges(activeModifications);
  };

  const hasChanges = Object.values(modifications).some(value => value !== null);

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200 shadow-lg">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            Personaliza tu Avatar
          </h3>
          <p className="text-sm text-gray-600">
            Selecciona las modificaciones que desees
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Color de cabello */}
        <CustomSelect
          value={modifications.hairColor || ''}
          onChange={(value) => handleChange('hairColor', value)}
          options={[{ value: '', label: 'Sin cambios' }, ...EDIT_OPTIONS.hairColor]}
          label="Color de cabello"
        />

        {/* Accesorios */}
        <CustomSelect
          value={modifications.accessories || ''}
          onChange={(value) => handleChange('accessories', value)}
          options={[{ value: '', label: 'Sin cambios' }, ...EDIT_OPTIONS.accessories]}
          label="Accesorios"
        />

        {/* Fondo */}
        <CustomSelect
          value={modifications.background || ''}
          onChange={(value) => handleChange('background', value)}
          options={[{ value: '', label: 'Sin cambios' }, ...EDIT_OPTIONS.background]}
          label="Fondo"
        />

        {/* Color de ojos */}
        <CustomSelect
          value={modifications.eyeColor || ''}
          onChange={(value) => handleChange('eyeColor', value)}
          options={[{ value: '', label: 'Sin cambios' }, ...EDIT_OPTIONS.eyeColor]}
          label="Color de ojos"
        />
      </div>

      {/* Botón aplicar cambios */}
      <button
        onClick={handleApply}
        disabled={!hasChanges || isLoading}
        className={`w-full mt-6 py-4 px-6 rounded-xl font-bold text-white text-lg shadow-lg transform transition-all duration-200 ${
          hasChanges && !isLoading
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105 hover:shadow-xl'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Aplicando cambios...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Aplicar Cambios
          </span>
        )}
      </button>
    </div>
  );
};

export default AvatarEditPanel;
