import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import './ErrorBoundary.scss';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log apenas em desenvolvimento
    if (import.meta.env.DEV) {
      console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }
    // Aqui você poderia enviar o erro para um serviço de monitoramento como Sentry
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="error-container">
          <h2>Algo deu errado</h2>
          <p>Ocorreu um erro inesperado. Por favor, tente novamente ou entre em contato com o suporte.</p>
          {import.meta.env.DEV && (
            <details>
              <summary>Detalhes do erro (apenas em desenvolvimento)</summary>
              <p>{this.state.error?.toString()}</p>
            </details>
          )}
          <button 
            className="retry-button"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Tentar novamente
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 