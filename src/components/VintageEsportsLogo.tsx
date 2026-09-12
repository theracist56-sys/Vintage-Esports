import React from 'react';

interface VintageEsportsLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  showText?: boolean;
  showGlow?: boolean;
  customLogoUrl?: string;
}

export const VintageEsportsLogo: React.FC<VintageEsportsLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  showGlow = true,
  customLogoUrl,
}) => {
  // Support both named size keys and numeric pixel dimensions
  let boxStyle = 'w-11 h-11';
  let textSize = 'text-2xl';
  let subSize = 'text-[9px]';
  let inlineDimension: React.CSSProperties = {};

  if (typeof size === 'number') {
    boxStyle = '';
    inlineDimension = { width: `${size}px`, height: `${size}px` };
    if (size <= 24) {
      textSize = 'text-base';
      subSize = 'text-[7px]';
    } else if (size <= 36) {
      textSize = 'text-xl';
      subSize = 'text-[8px]';
    } else if (size <= 50) {
      textSize = 'text-2xl';
      subSize = 'text-[9px]';
    } else {
      textSize = 'text-3xl';
      subSize = 'text-[11px]';
    }
  } else {
    const sizeMap: Record<string, { box: string; text: string; sub: string }> = {
      sm: { box: 'w-8 h-8', text: 'text-lg', sub: 'text-[8px]' },
      md: { box: 'w-11 h-11', text: 'text-2xl', sub: 'text-[9px]' },
      lg: { box: 'w-16 h-16', text: 'text-3xl', sub: 'text-[11px]' },
      xl: { box: 'w-24 h-24', text: 'text-5xl', sub: 'text-sm' },
    };
    const matched = sizeMap[size] || sizeMap.md;
    boxStyle = matched.box;
    textSize = matched.text;
    subSize = matched.sub;
  }

  const glowClass = showGlow ? 'filter drop-shadow-[0_0_15px_rgba(234,179,8,0.55)]' : '';

  if (customLogoUrl) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <img
          src={customLogoUrl}
          alt="Custom Logo"
          style={inlineDimension}
          className={`${boxStyle} object-contain rounded-lg ${showGlow ? 'filter drop-shadow-[0_0_12px_rgba(234,179,8,0.5)]' : ''}`}
        />
        {showText && (
          <div className="flex flex-col">
            <span className={`font-teko tracking-wider font-bold uppercase leading-none text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-amber-300 to-yellow-500 drop-shadow-[0_2px_8px_rgba(234,179,8,0.4)] ${textSize}`}>
              VINTAGE
            </span>
            <span className={`font-rajdhani font-black tracking-[0.25em] uppercase leading-none text-slate-300 drop-shadow-sm ${subSize}`}>
              ESPORTS
            </span>
          </div>
        )}
      </div>
    );
  }

  // Official Vintage Esports Gold Crest Monogram
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        style={inlineDimension}
        className={`relative ${boxStyle} flex-shrink-0 flex items-center justify-center rounded-xl overflow-hidden border border-amber-500/40 bg-black/80 shadow-md shadow-amber-950/40 ${glowClass}`}
      >
        <img
          src="/pwa-192x192.png"
          alt="Vintage Esports Logo"
          className="w-full h-full object-cover"
        />
      </div>

      {showText && (
        <div className="flex flex-col select-none">
          <div className="flex items-center gap-1">
            <span className={`font-teko tracking-[0.08em] font-black uppercase leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-200 to-yellow-500 drop-shadow-[0_2px_10px_rgba(234,179,8,0.5)] ${textSize}`}>
              VINTAGE
            </span>
          </div>
          <span className={`font-rajdhani font-black tracking-[0.3em] uppercase leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400 drop-shadow-sm ${subSize}`}>
            ESPORTS
          </span>
        </div>
      )}
    </div>
  );
};
