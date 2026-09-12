import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { 
  Download, 
  Smartphone, 
  CheckCircle2, 
  Share, 
  PlusSquare, 
  X, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  ArrowRight,
  WifiOff
} from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { hasNativePrompt, isIOS, triggerInstall, isInstalled } = usePWAInstall();
  const [installStatus, setInstallStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (hasNativePrompt) {
      const outcome = await triggerInstall();
      if (outcome === 'accepted') {
        setInstallStatus('installed');
        setTimeout(() => onClose(), 2000);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-[#181309] to-[#0c0a06] border border-amber-500/40 p-6 shadow-2xl shadow-amber-950/50 text-amber-50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* App Branding Crest Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img 
              src="/pwa-192x192.png" 
              alt="Vintage Esports Icon" 
              className="w-full h-full object-cover rounded-[14px]"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-cinzel text-lg font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-500">
                VINTAGE ESPORTS
              </h3>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase">
                APP
              </span>
            </div>
            <p className="text-xs text-amber-200/60 font-rajdhani font-semibold">
              Install to Home Screen & Launch in Full Screen
            </p>
          </div>
        </div>

        {/* Benefits Cards */}
        <div className="space-y-2 mb-6 text-xs font-rajdhani">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="text-amber-100">No App Store or APK download needed — installs instantaneously</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
            <Layers className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            <span className="text-amber-100">Launches full screen like a native esports app without browser bars</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
            <WifiOff className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-amber-100">Offline points calculation and tournament data saved locally</span>
          </div>
        </div>

        {/* Action / Instructions depending on device */}
        {isInstalled ? (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="font-bold text-sm text-emerald-200 font-rajdhani">
              App is already installed on this device!
            </p>
            <p className="text-xs text-emerald-300/70 mt-1">
              Check your home screen or app drawer to launch Vintage Esports Studio anytime.
            </p>
          </div>
        ) : isIOS ? (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30">
              <p className="text-xs font-bold text-amber-200 uppercase tracking-wider mb-2 font-rajdhani">
                How to install on iPhone / iPad (Safari):
              </p>
              <ol className="space-y-2 text-xs text-amber-100/90 font-rajdhani">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/30 text-amber-300 font-bold flex items-center justify-center text-[11px] flex-shrink-0">1</span>
                  <span>Tap the <Share className="w-3.5 h-3.5 text-blue-400 inline mx-1" /> <strong>Share</strong> icon in Safari's bottom toolbar</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/30 text-amber-300 font-bold flex items-center justify-center text-[11px] flex-shrink-0">2</span>
                  <span>Scroll down and tap <PlusSquare className="w-3.5 h-3.5 text-amber-400 inline mx-1" /> <strong>"Add to Home Screen"</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/30 text-amber-300 font-bold flex items-center justify-center text-[11px] flex-shrink-0">3</span>
                  <span>Tap <strong>"Add"</strong> in the top-right corner. All done!</span>
                </li>
              </ol>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold font-rajdhani tracking-wider transition cursor-pointer"
            >
              GOT IT
            </button>
          </div>
        ) : hasNativePrompt ? (
          <div className="space-y-3">
            <button
              onClick={handleInstallClick}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-yellow-300 text-black font-black font-rajdhani tracking-wider text-sm shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer transition active:scale-98 uppercase"
            >
              <Download className="w-4 h-4 text-black" />
              <span>INSTALL APP ON THIS DEVICE</span>
            </button>
            <p className="text-[11px] text-center text-zinc-400 font-rajdhani">
              One-click install directly to your phone's home screen
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-100 font-rajdhani">
              <p className="font-bold text-amber-200 mb-1.5 uppercase tracking-wide">
                How to install on Android (Chrome / Brave / Edge):
              </p>
              <ol className="space-y-1.5">
                <li>1. Open the browser menu (<strong>⋮</strong> three dots top-right).</li>
                <li>2. Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                <li>3. Confirm <strong>Install</strong> to get the standalone app icon on your home screen.</li>
              </ol>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-xs font-bold font-rajdhani tracking-wider transition cursor-pointer"
            >
              GOT IT
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
