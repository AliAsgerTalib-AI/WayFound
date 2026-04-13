import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-surface-container-highest p-8 text-center">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-error" />
            </div>
            <h1 className="text-2xl font-headline font-bold text-on-surface mb-4">
              Something went wrong
            </h1>
            <p className="text-on-surface-variant mb-8 leading-relaxed">
              We encountered an unexpected error. Don't worry, your travel data is safe, but we need to restart the application.
            </p>
            
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mb-8 p-4 bg-surface-container-low rounded-lg text-left overflow-auto max-h-40">
                <p className="text-xs font-mono text-error">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-primary text-on-primary rounded-full font-bold flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <RefreshCcw className="w-4 h-4" />
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="w-full py-3 bg-surface-container-highest text-on-surface rounded-full font-bold flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Home className="w-4 h-4" />
                Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
