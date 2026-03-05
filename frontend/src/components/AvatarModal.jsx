import { useState, useRef, useEffect } from 'react';
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

  // Estados para selección de método y cámara
  const [captureMethod, setCaptureMethod] = useState(null); // 'upload' | 'camera' | null
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Estados para envío por correo
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  /**
   * Limpia el stream de la cámara cuando se desmonta
   */
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  /**
   * Conecta el stream al video cuando ambos estén disponibles
   */
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      // Asegurar que el video se reproduzca
      videoRef.current.play().catch(err => {
        console.error('Error al reproducir video:', err);
      });
    }
  }, [stream]);

  /**
   * Inicia la cámara
   */
  const startCamera = async () => {
    try {
      setError('');
      console.log('Solicitando acceso a la cámara...');
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      
      console.log('Cámara activada:', mediaStream.getVideoTracks());
      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (err) {
      console.error('Error al acceder a la cámara:', err);
      setError('No se pudo acceder a la cámara. Verifica los permisos.');
    }
  };

  /**
   * Detiene la cámara
   */
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  /**
   * Captura una foto desde el video
   */
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error('Video o canvas no disponible');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Verificar que el video tenga dimensiones
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setError('El video aún no está listo. Espera un momento.');
      return;
    }

    const context = canvas.getContext('2d');

    // Establecer dimensiones del canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dibujar el frame actual del video
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convertir canvas a blob y luego a file
    canvas.toBlob((blob) => {
      if (!blob) {
        setError('Error al capturar la imagen. Intenta nuevamente.');
        return;
      }

      const file = new File([blob], `captured-photo-${Date.now()}.jpg`, {
        type: 'image/jpeg'
      });
      
      setSelectedImage(file);
      stopCamera();
    }, 'image/jpeg', 0.95);
  };

  /**
   * Maneja la selección del método de captura
   */
  const handleMethodSelect = async (method) => {
    setCaptureMethod(method);
    
    if (method === 'camera') {
      await startCamera();
    }
  };

  /**
   * Volver a tomar foto (resetear al estado inicial de método)
   */
  const handleRetakePhoto = () => {
    setSelectedImage(null);
    setCaptureMethod(null);
    stopCamera();
  };

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
   * Envía el avatar por correo electrónico
   */
  const handleSendEmail = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setEmailError('Por favor ingresa un correo válido');
      return;
    }

    setIsSendingEmail(true);
    setEmailError('');
    setEmailSuccess(false);

    try {
      const avatarToSend = editedAvatar || baseAvatar;
      
      const response = await fetch('http://localhost:5000/api/send-avatar-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          avatar: avatarToSend
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el correo');
      }

      setEmailSuccess(true);
      setEmail('');
      
      // Si hay preview URL (modo testing), guardarlo y abrir en nueva pestaña
      if (data.previewUrl) {
        setPreviewUrl(data.previewUrl);
        console.log('🔗 Preview URL:', data.previewUrl);
        // Abrir el preview en nueva pestaña después de medio segundo
        setTimeout(() => {
          window.open(data.previewUrl, '_blank');
        }, 500);
      } else {
        setPreviewUrl('');
      }
      
      // Ocultar formulario después de 5 segundos (más si hay preview)
      setTimeout(() => {
        setShowEmailForm(false);
        setEmailSuccess(false);
        setPreviewUrl('');
      }, data.previewUrl ? 8000 : 3000);

    } catch (err) {
      setEmailError(err.message || 'Error al enviar el correo. Intenta nuevamente.');
      console.error('Error:', err);
    } finally {
      setIsSendingEmail(false);
    }
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
    setCaptureMethod(null);
    stopCamera();
    setShowEmailForm(false);
    setEmail('');
    setEmailSuccess(false);
    setEmailError('');
    setPreviewUrl('');
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
            // FASE 1: Selección de método y captura/subida de imagen
            <div className="max-w-xl mx-auto">
              {!captureMethod ? (
                // Paso 1: Elegir método de captura
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    ¿Cómo quieres obtener tu foto?
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Elige una opción para comenzar
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Botón Subir Foto */}
                    <button
                      onClick={() => handleMethodSelect('upload')}
                      className="group relative p-8 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-2 border-purple-200 hover:border-purple-400 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                    >
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl group-hover:shadow-lg transition-all duration-300">
                          <svg
                            className="w-10 h-10 text-white"
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
                          <h4 className="text-xl font-bold text-gray-800 mb-1">
                            Subir Foto
                          </h4>
                          <p className="text-sm text-gray-600">
                            Desde tu dispositivo
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Botón Tomar Foto */}
                    <button
                      onClick={() => handleMethodSelect('camera')}
                      className="group relative p-8 bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border-2 border-blue-200 hover:border-blue-400 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                    >
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl group-hover:shadow-lg transition-all duration-300">
                          <svg
                            className="w-10 h-10 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-800 mb-1">
                            Tomar Foto
                          </h4>
                          <p className="text-sm text-gray-600">
                            Con tu cámara
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              ) : captureMethod === 'upload' ? (
                // Paso 2a: Subir imagen
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <button
                      onClick={handleRetakePhoto}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <h3 className="text-2xl font-bold text-gray-800">
                      Sube tu Foto
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    La IA analizará tu imagen y creará un avatar 3D que preserva tus características
                  </p>

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
              ) : captureMethod === 'camera' && !selectedImage ? (
                // Paso 2b: Capturar con cámara
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <button
                      onClick={handleRetakePhoto}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <h3 className="text-2xl font-bold text-gray-800">
                      Toma tu Foto
                    </h3>
                  </div>

                  {isCameraActive ? (
                    <div className="space-y-6">
                      {/* Vista previa de la cámara */}
                      <div className="relative bg-black rounded-2xl overflow-hidden" style={{ minHeight: '400px' }}>
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                          style={{ minHeight: '400px' }}
                          onLoadedMetadata={(e) => {
                            console.log('Video cargado:', e.target.videoWidth, 'x', e.target.videoHeight);
                          }}
                        />
                        
                        {/* Guía visual para centrar el rostro */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-64 h-64 border-4 border-white/30 rounded-full"></div>
                        </div>
                      </div>

                      {/* Botón Capturar */}
                      <button
                        onClick={capturePhoto}
                        className="w-full py-5 px-8 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
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
                              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                          </svg>
                          Capturar Foto
                        </span>
                      </button>

                      {/* Canvas oculto para captura */}
                      <canvas 
                        ref={canvasRef} 
                        style={{ position: 'absolute', left: '-9999px' }}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-4 text-gray-600">Iniciando cámara...</p>
                    </div>
                  )}
                </div>
              ) : (
                // Paso 3: Preview de foto capturada y generar
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Vista Previa
                  </h3>

                  {/* Preview de la imagen capturada */}
                  <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Foto capturada"
                      className="w-full max-w-md mx-auto h-auto object-cover rounded-xl shadow-lg"
                    />
                  </div>

                  {/* Botones */}
                  <div className="space-y-4">
                    <button
                      onClick={handleGenerateAvatar}
                      className="w-full py-5 px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
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

                    <button
                      onClick={handleRetakePhoto}
                      className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
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
                      Volver a Tomar Foto
                    </button>
                  </div>
                </div>
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
                <div className="grid grid-cols-1 gap-4">
                  {/* Primera fila: 3 botones */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={handleRegenerate}
                      className="py-3 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                    >
                      <svg
                        className="w-4 h-4"
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
                      Regenerar
                    </button>

                    <button
                      onClick={handleDownload}
                      className="py-3 px-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                    >
                      <svg
                        className="w-4 h-4"
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
                      Guardar
                    </button>

                    <button
                      onClick={() => setShowEmailForm(!showEmailForm)}
                      className="py-3 px-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Enviar
                    </button>
                  </div>

                  {/* Formulario de email (se muestra cuando showEmailForm es true) */}
                  {showEmailForm && (
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border-2 border-blue-200 space-y-4">
                      <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        Enviar por Correo
                      </h4>
                      
                      <form onSubmit={handleSendEmail} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tu correo electrónico:
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ejemplo@correo.com"
                            disabled={isSendingEmail}
                            className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            required
                          />
                        </div>

                        {/* Mensaje de error */}
                        {emailError && (
                          <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg flex items-start gap-2">
                            <svg
                              className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <p className="text-sm text-red-800">{emailError}</p>
                          </div>
                        )}

                        {/* Mensaje de éxito */}
                        {emailSuccess && (
                          <div className="p-3 bg-green-50 border-2 border-green-200 rounded-lg space-y-2">
                            <div className="flex items-start gap-2">
                              <svg
                                className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <div className="flex-1">
                                <p className="text-sm text-green-800 font-semibold">
                                  {previewUrl ? '¡Correo generado (Modo Testing)!' : '¡Avatar enviado correctamente!'}
                                </p>
                                <p className="text-xs text-green-700 mt-1">
                                  {previewUrl ? 'Abriendo preview en nueva pestaña...' : 'Revisa tu correo.'}
                                </p>
                                {previewUrl && (
                                  <a
                                    href={previewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:text-blue-800 underline mt-1 inline-block"
                                  >
                                    Abrir preview manualmente
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={isSendingEmail}
                          className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                        >
                          {isSendingEmail ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              Enviando...
                            </>
                          ) : (
                            <>
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
                                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                />
                              </svg>
                              Enviar Avatar
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  )}
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
