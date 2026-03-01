import { useState } from 'react';
import ImageUploader from './ImageUploader';
import AvatarEditor from './AvatarEditor';
import AvatarPreview from './AvatarPreview';
import LoadingSpinner from './LoadingSpinner';
import { generateAvatar } from '../services/avatarService';

const AvatarModal = ({ isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [avatarOptions, setAvatarOptions] = useState({
    skinTone: 'medio',
    hairType: 'corto',
    hairColor: 'castaño',
    accessory: 'ninguno',
    eyeColor: 'marrón',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [generatedAvatar, setGeneratedAvatar] = useState(null);
  const [error, setError] = useState('');

  const handleGenerateAvatar = async () => {
    if (!selectedImage) {
      setError('Por favor selecciona una imagen primero');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await generateAvatar(selectedImage, avatarOptions);
      setGeneratedAvatar(result.data.image);
    } catch (err) {
      setError(err.message || 'Error al generar el avatar. Intenta nuevamente.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    setGeneratedAvatar(null);
    setError('');
  };

  const handleClose = () => {
    setSelectedImage(null);
    setGeneratedAvatar(null);
    setError('');
    setAvatarOptions({
      skinTone: 'medio',
      hairType: 'corto',
      hairColor: 'castaño',
      accessory: 'ninguno',
      eyeColor: 'marrón',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-800">
            Generador de Avatar con IA
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <LoadingSpinner message="Generando tu avatar con IA..." />
          ) : generatedAvatar ? (
            <AvatarPreview
              generatedAvatar={generatedAvatar}
              onRegenerate={handleRegenerate}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Image Upload */}
              <div>
                <ImageUploader
                  onImageSelect={setSelectedImage}
                  selectedImage={selectedImage}
                />
              </div>

              {/* Right Side - Avatar Options */}
              <div>
                <AvatarEditor
                  options={avatarOptions}
                  onChange={setAvatarOptions}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-semibold text-red-800">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Generate Button */}
          {!generatedAvatar && !isLoading && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleGenerateAvatar}
                disabled={!selectedImage}
                className="btn-primary text-lg px-8 py-4"
              >
                <span className="flex items-center gap-3">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Generar Avatar con IA
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarModal;
