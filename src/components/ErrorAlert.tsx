export function ErrorAlert({ message, onRetry }: { 
    message: string; 
    onRetry?: () => void 
  }) {
    return (
      <div className="p-4 mb-4 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-center text-red-800">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{message}</span>
        </div>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="mt-2 px-3 py-1 text-sm bg-red-100 hover:bg-red-200 rounded"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }