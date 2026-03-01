import { AVATAR_OPTIONS } from '../utils/constants';
import CustomSelect from './CustomSelect';

const AvatarEditor = ({ options, onChange }) => {
  const handleChange = (field, value) => {
    onChange({
      ...options,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Personaliza tu avatar
      </h3>

      {/* Color de piel */}
      <CustomSelect
        value={options.skinTone}
        onChange={(value) => handleChange('skinTone', value)}
        options={AVATAR_OPTIONS.skinTone}
        label="Color de piel"
      />

      {/* Tipo de cabello */}
      <CustomSelect
        value={options.hairType}
        onChange={(value) => handleChange('hairType', value)}
        options={AVATAR_OPTIONS.hairType}
        label="Tipo de cabello"
      />

      {/* Color de cabello */}
      <CustomSelect
        value={options.hairColor}
        onChange={(value) => handleChange('hairColor', value)}
        options={AVATAR_OPTIONS.hairColor}
        label="Color de cabello"
      />

      {/* Accesorios */}
      <CustomSelect
        value={options.accessory}
        onChange={(value) => handleChange('accessory', value)}
        options={AVATAR_OPTIONS.accessory}
        label="Accesorios"
      />

      {/* Color de ojos */}
      <CustomSelect
        value={options.eyeColor}
        onChange={(value) => handleChange('eyeColor', value)}
        options={AVATAR_OPTIONS.eyeColor}
        label="Color de ojos"
      />
    </div>
  );
};

export default AvatarEditor;


