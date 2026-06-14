import React from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full text-center border border-gray-100">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 p-4 rounded-full">
                <AlertTriangle className="w-12 h-12 text-red-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-8">
              We're sorry, but the application encountered an unexpected error.
            </p>
            
            <div className="bg-gray-50 p-4 rounded text-left text-sm text-red-800 font-mono overflow-auto mb-8 max-h-48 border border-gray-200">
              {this.state.error && this.state.error.toString()}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="flex items-center justify-center px-6 py-2.5 bg-[#FF9900] hover:bg-[#e38800] text-black font-bold rounded-full transition-colors"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Reload Page
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="flex items-center justify-center px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-full transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
