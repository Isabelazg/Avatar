const AvatarPreview = ({ generatedAvatar, onRegenerate, onSave }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${generatedAvatar}`;
    link.download = `avatar-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          ¡Tu avatar está listo!
        </h3>
        <div className="relative inline-block">
          <img
            src={`data:image/png;base64,${generatedAvatar}`}
            alt="Avatar generado"
            className="w-80 h-80 object-cover rounded-2xl shadow-2xl"
          />
          <div className="absolute inset-0 rounded-2xl ring-4 ring-blue-500/20"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          onClick={onRegenerate}
          className="btn-secondary flex items-center justify-center gap-2"
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
          Regenerar
        </button>

        <button
          onClick={handleDownload}
          className="btn-primary flex items-center justify-center gap-2"
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
          Guardar Avatar
        </button>
      </div>
    </div>
  );
};

export default AvatarPreview;
