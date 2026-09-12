import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error in Vintage Esports App:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#080705] text-amber-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#141008] border border-amber-500/40 rounded-2xl p-6 text-center shadow-2xl shadow-black/90">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold font-teko tracking-wider uppercase text-amber-300">
              Session Recovery Mode
            </h2>
            <p className="text-xs text-amber-200/70 font-rajdhani mt-2 leading-relaxed">
              The studio encountered a temporary state conflict. Click below to restore clean defaults and restart.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={this.handleReset}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold font-rajdhani text-sm tracking-wider uppercase shadow-lg shadow-amber-500/20 cursor-pointer transition active:scale-95"
              >
                Reset & Reload Studio
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2 px-4 rounded-xl bg-[#221a0d] hover:bg-[#2d2212] text-amber-300 border border-amber-500/30 font-bold font-rajdhani text-xs tracking-wider uppercase cursor-pointer transition"
              >
                Simple Refresh
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
