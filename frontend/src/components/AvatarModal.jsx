import { useState } from 'react';
import ImageUploader from './ImageUploader';
import AvatarEditPanel from './AvatarEditPanel';
import LoadingSpinner from './LoadingSpinner';
import { generateAvatar, editAvatar } from '../services/avatarService';

const AvatarModal = ({ isOpen, onClose }) => {
  // FASE 1: Subir imagen y generar avatar base
  const [selectedImage, setSelectedImage] = useState(null);
  const [baseAvatar, setBaseAvatar] = useState(null);
  const [description, setDescription] = useState(null);
  
  // FASE 2: Editar avatar
  const [editMode, setEditMode] = useState(false);
  const [editedAvatar, setEditedAvatar] = useState(null);
  
  // Estados generales
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState('');

  /**
   * Genera el avatar base (análisis + generación)
   */
  const handleGenerateAvatar = async () => {
    if (!selectedImage) {
      setError('Por favor selecciona una imagen primero');
      return;
    }

    setIsLoading(true);
    setError('');
    setLoadingMessage('Analizando tu imagen con IA...');

    try {
      // Llamar al backend: análisis + generación automática
      const result = await generateAvatar(selectedImage);
      
      // Guardar avatar base y descripción
      setBaseAvatar(result.data.avatar);
      setDescription(result.data.description);
      setEditMode(true); // Activar modo edición
      
      console.log('Avatar base generado:', result);
    } catch (err) {
      setError(err.message || 'Error al generar el avatar. Intenta nuevamente.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  /**
   * Aplica cambios de edición al avatar
   */
  const handleApplyChanges = async (modifications) => {
    setIsLoading(true);
    setError('');
    setLoadingMessage('Aplicando tus cambios al avatar...');

    try {
      // Verificar que existe la descripción original
      if (!description) {
        throw new Error('No hay descripción original del avatar. Genera un avatar primero.');
      }
      
      // Llamar al backend para editar usando descripción original
      const result = await editAvatar(description, modifications);
      
      // Guardar avatar editado
      setEditedAvatar(result.data.avatar);
      
      console.log('Avatar editado:', result);
    } catch (err) {
      setError(err.message || 'Error al editar el avatar. Intenta nuevamente.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  /**
   * Descarga el avatar actual
   */
  const handleDownload = () => {
    const avatarToDownload = editedAvatar || baseAvatar;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${avatarToDownload}`;
    link.download = `mi-avatar-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Reinicia todo el flujo
   */
  const handleRegenerate = () => {
    setSelectedImage(null);
    setBaseAvatar(null);
    setDescription(null);
    setEditMode(false);
    setEditedAvatar(null);
    setError('');
  };

  /**
   * Cierra el modal y limpia estados
   */
  const handleClose = () => {
    handleRegenerate();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop con blur */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-6xl max-h-[95vh] overflow-y-auto bg-white rounded-3xl shadow-2xl">
        {/* Header con gradiente */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-5 flex items-center justify-between rounded-t-3xl">
          <div>
            <h2 className="text-3xl font-bold text-white">
              Generadar tu Avatar
            </h2>
            <p className="text-purple-100 text-sm mt-1">
              Crea y personaliza tu avatar
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/20 rounded-full transition-all duration-200"
          >
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {isLoading ? (
            // Loading State
            <LoadingSpinner message={loadingMessage} />
          ) : !editMode ? (
            // FASE 1: Subir imagen y generar
            <div className="max-w-xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Sube tu Foto
                </h3>
                <p className="text-gray-600">
                  La IA analizará tu imagen y creará un avatar 3D que preserva tus características
                </p>
              </div>

              <ImageUploader
                onImageSelect={setSelectedImage}
                selectedImage={selectedImage}
              />

              {/* Botón Generar */}
              {selectedImage && (
                <button
                  onClick={handleGenerateAvatar}
                  className="w-full mt-8 py-5 px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <span className="flex items-center justify-center gap-3">
                    <svg
                      className="w-7 h-7"
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
                    Generar Mi Avatar
                  </span>
                </button>
              )}
            </div>
          ) : (
            // FASE 2: Mostrar avatar y panel de edición
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Izquierda: Vista previa del avatar */}
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {editedAvatar ? 'Avatar Editado' : 'Tu Avatar Base'}
                  </h3>
                  <div className="relative inline-block">
                    <img
                      src={`data:image/png;base64,${editedAvatar || baseAvatar}`}
                      alt="Avatar generado"
                      className="w-full max-w-md h-auto object-cover rounded-3xl shadow-2xl ring-4 ring-purple-200"
                    />
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleRegenerate}
                    className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Empezar de Nuevo
                  </button>

                  <button
                    onClick={handleDownload}
                    className="py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Descargar
                  </button>
                </div>
              </div>

              {/* Derecha: Panel de edición */}
              <div>
                <AvatarEditPanel 
                  onApplyChanges={handleApplyChanges}
                  isLoading={isLoading}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-5 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-4">
              <svg
                className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0"
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
                <p className="text-base font-bold text-red-900">Error</p>
                <p className="text-sm text-red-800 mt-1">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarModal;
