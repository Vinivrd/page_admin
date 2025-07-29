import { AlertCircle, XCircle } from 'lucide-react';
import './ErrorMessage.scss';

interface ErrorMessageProps {
  message: string;
  details?: string;
  onDismiss?: () => void;
  variant?: 'warning' | 'error';
}

const ErrorMessage = ({ 
  message, 
  details, 
  onDismiss, 
  variant = 'error' 
}: ErrorMessageProps) => {
  return (
    <div className={`error-message ${variant}`}>
      <div className="error-message-icon">
        <AlertCircle size={20} />
      </div>
      <div className="error-message-content">
        <p className="error-message-text">{message}</p>
        {details && (
          <details className="error-message-details">
            <summary>Ver detalhes</summary>
            <p>{details}</p>
          </details>
        )}
      </div>
      {onDismiss && (
        <button 
          className="error-message-dismiss" 
          onClick={onDismiss}
          aria-label="Fechar"
        >
          <XCircle size={18} />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage; 