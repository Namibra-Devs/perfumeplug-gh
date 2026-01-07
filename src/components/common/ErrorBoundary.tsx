import { Component, ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home, ShoppingBag } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId: string;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorId: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    // Generate a unique error ID for tracking
    const errorId = `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return { hasError: true, error, errorId };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // In production, you could send this to an error reporting service
    if (import.meta.env.PROD) {
      // Example: Send to error tracking service
      // errorTrackingService.captureException(error, { extra: errorInfo, tags: { errorId: this.state.errorId } });
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorId: '' });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-r from-black/95 to-yellow-700/95 flex items-center justify-center px-4 py-8">
          <div className="text-center text-white max-w-2xl mx-auto">
            {/* Error Icon */}
            <div className="mb-8">
              <div className="relative w-24 h-24 mx-auto mb-6">
                {/* Animated background rings */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-gradient-to-r from-red-600/30 to-red-700/30 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-12 w-12 text-red-400 animate-bounce" />
                </div>
                {/* Floating particles */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>

            {/* Error Message */}
            <div className="mb-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-300 text-lg mb-4 leading-relaxed max-w-lg mx-auto">
                We encountered an unexpected error. Don't worry, our team has been notified and we're working on a fix.
              </p>
              <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-lg border border-yellow-500/30 rounded-full px-4 py-2">
                <span className="text-gray-400 text-sm">Error ID:</span>
                <code className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm font-mono">
                  {this.state.errorId}
                </code>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={this.handleRetry}
                className="group flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform active:scale-95"
              >
                <RefreshCw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                <span>Try Again</span>
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="group flex items-center justify-center gap-3 bg-black/30 backdrop-blur-lg border-2 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-400 hover:text-yellow-300 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform active:scale-95"
              >
                <RefreshCw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                <span>Refresh Page</span>
              </button>
            </div>

            {/* Navigation Options */}
            <div className="bg-black/30 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-8 shadow-2xl">
              <h3 className="text-xl font-bold mb-6 text-yellow-400">Continue browsing:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  to="/"
                  className="group flex flex-col items-center gap-3 text-gray-300 hover:text-white p-6 rounded-xl hover:bg-gradient-to-br hover:from-yellow-500/10 hover:to-amber-500/10 border border-transparent hover:border-yellow-500/20 transition-all duration-300 hover:scale-105 transform"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Home className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-semibold">Home</span>
                  <span className="text-xs text-gray-400 text-center">Return to homepage</span>
                </Link>
                
                <Link
                  to="/shop"
                  className="group flex flex-col items-center gap-3 text-gray-300 hover:text-white p-6 rounded-xl hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-pink-500/10 border border-transparent hover:border-purple-500/20 transition-all duration-300 hover:scale-105 transform"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <ShoppingBag className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-semibold">Shop</span>
                  <span className="text-xs text-gray-400 text-center">Browse products</span>
                </Link>
                
                <Link
                  to="/contact"
                  className="group flex flex-col items-center gap-3 text-gray-300 hover:text-white p-6 rounded-xl hover:bg-gradient-to-br hover:from-red-500/10 hover:to-orange-500/10 border border-transparent hover:border-red-500/20 transition-all duration-300 hover:scale-105 transform"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-semibold">Report Issue</span>
                  <span className="text-xs text-gray-400 text-center">Get help</span>
                </Link>
              </div>
            </div>

            {/* Developer Info */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-10 text-left max-w-4xl mx-auto">
                <summary className="cursor-pointer text-yellow-400 mb-4 hover:text-yellow-300 transition-colors duration-200 flex items-center gap-2 justify-center">
                  <span className="text-2xl">🔧</span>
                  <span className="font-semibold">Error Details (Development Only)</span>
                </summary>
                <div className="bg-black/60 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 shadow-2xl">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <strong className="text-red-400 text-lg">Error Message</strong>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <code className="text-red-300 text-sm font-mono">{this.state.error.message}</code>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <strong className="text-orange-400 text-lg">Stack Trace</strong>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-600/30 rounded-lg p-4 max-h-60 overflow-auto">
                      <pre className="text-gray-300 text-xs font-mono whitespace-pre-wrap leading-relaxed">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  </div>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;