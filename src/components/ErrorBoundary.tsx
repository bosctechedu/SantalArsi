import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

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
    console.error('Santal आ़रसी caught an error in ErrorBoundary:', error, errorInfo);
  }

  private handleReset = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
      if ('caches' in window) {
        const names = await caches.keys();
        await Promise.all(names.map((name) => caches.delete(name)));
      }
      this.setState({ hasError: false, error: null });
      window.location.reload();
    } catch {
      window.location.href = '/';
    }
  };

  private handleClearStorageAndReload = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
      if ('caches' in window) {
        const names = await caches.keys();
        await Promise.all(names.map((name) => caches.delete(name)));
      }
      // Clear app state keys without losing admin password
      const adminPass = localStorage.getItem('hor_katha_admin_password');
      const adminPassSet = localStorage.getItem('hor_katha_admin_password_set');
      localStorage.clear();
      if (adminPass) {
        localStorage.setItem('hor_katha_admin_password', adminPass);
      }
      if (adminPassSet) {
        localStorage.setItem('hor_katha_admin_password_set', adminPassSet);
      }
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4 font-sans">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-6 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shadow-sm">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Santal आ़रसी Recovery
              </h2>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                A temporary display issue occurred. Your saved dictionary words and data are safe.
              </p>
              {this.state.error?.message && (
                <p className="mt-2 text-[11px] font-mono bg-rose-50 p-2 rounded-xl text-rose-700 border border-rose-200 truncate">
                  {this.state.error.message}
                </p>
              )}
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={this.handleReset}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>

              <button
                onClick={this.handleClearStorageAndReload}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-200"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Reset Cache &amp; Return Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
