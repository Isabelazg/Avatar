import { useState } from 'react';
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '../utils/constants';

const ImageUploader = ({ onImageSelect, selectedImage }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const validateFile = (file) => {
    setError('');

    if (!file) {
      setError('Por favor selecciona una imagen');
      return false;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError('Formato no válido. Solo se aceptan JPEG, PNG y WEBP');
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('La imagen es demasiado grande. Máximo 10MB');
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      onImageSelect(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      onImageSelect(file);
    }
  };

  return (
    <div className="w-full">
      <label className="label">Sube tu foto</label>
      
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {selectedImage ? (
          <div className="space-y-4">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Preview"
              className="w-48 h-48 object-cover rounded-lg mx-auto shadow-md"
            />
            <p className="text-sm text-gray-600">{selectedImage.name}</p>
            <button
              onClick={() => onImageSelect(null)}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Eliminar imagen
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 mb-2">
                Arrastra y suelta tu imagen aquí, o
              </p>
              <label className="cursor-pointer text-blue-600 hover:text-blue-700 font-semibold">
                selecciona un archivo
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">
              JPEG, PNG o WEBP (máx. 10MB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default ImageUploader;
