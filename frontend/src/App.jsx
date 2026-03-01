import { useState } from 'react';
import AvatarModal from './components/AvatarModal';
import './index.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Avatar Generator AI
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <h2 className="text-5xl font-bold text-gray-800">
              Crea tu Avatar Personalizado
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transforma tu foto en un increíble avatar 3D estilo Pixar usando
              Inteligencia Artificial
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <div className="card">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                Sube tu foto
              </h3>
              <p className="text-gray-600 text-sm">
                Arrastra y suelta o selecciona una imagen desde tu dispositivo
              </p>
            </div>

            <div className="card">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                Personaliza
              </h3>
              <p className="text-gray-600 text-sm">
                Ajusta el color de piel, cabello, ojos y accesorios
              </p>
            </div>

            <div className="card">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-pink-600"
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
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                Genera con IA
              </h3>
              <p className="text-gray-600 text-sm">
                Nuestra IA crea tu avatar 3D en segundos
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary text-xl px-12 py-5"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Crear Mi Avatar Ahora
              </span>
            </button>
          </div>

          {/* Info */}
          <div className="pt-12 text-sm text-gray-500">
            <p>Powered by OpenAI DALL-E 3 • Estilo Pixar/Disney</p>
          </div>
        </div>
      </main>

      {/* Modal */}
      <AvatarModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default App;
