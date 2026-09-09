import { AlertCircle } from 'lucide-react';

const ErrorState = ({ 
  message = 'Something went wrong. Please try again later.',
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Error Occurred
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        {message}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
