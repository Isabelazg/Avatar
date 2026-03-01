const LoadingSpinner = ({ message = 'Generando tu avatar...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <div className="relative">
        <div className="w-24 h-24 border-8 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-24 h-24 border-8 border-transparent border-r-purple-600 rounded-full animate-spin-slow"></div>
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-lg font-semibold text-gray-800">{message}</p>
        <p className="text-sm text-gray-500">
          Esto puede tomar unos segundos...
        </p>
      </div>

      <div className="flex gap-2">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
