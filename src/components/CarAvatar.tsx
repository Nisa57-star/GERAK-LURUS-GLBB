import React from 'react';
import { PlayerColorTheme } from '../types/game';

interface CarAvatarProps {
  theme: PlayerColorTheme;
  playerName: string;
  isMoving?: boolean;
  feedback?: 'idle' | 'correct' | 'wrong';
  isFinished?: boolean;
  score?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  playerNumber?: number;
}

export const CarAvatar: React.FC<CarAvatarProps> = ({
  theme,
  playerName,
  isMoving = false,
  feedback = 'idle',
  isFinished = false,
  score,
  size = 'md',
  showLabel = false,
  playerNumber,
}) => {
  // Extract number from playerName if not provided (e.g., "Pemain 1" -> "1", "P1" -> "1")
  const pNum = playerNumber !== undefined ? String(playerNumber) : (playerName.replace(/\D/g, '') || '1');

  // Dimension scaling
  const dim = {
    sm: { width: 72, height: 42 },
    md: { width: 98, height: 54 },
    lg: { width: 126, height: 70 },
    xl: { width: 154, height: 86 },
  }[size];

  // Dynamic animation classes
  let animClass = 'transition-transform duration-300';
  if (feedback === 'wrong') {
    animClass += ' animate-shake';
  } else if (isMoving) {
    animClass += ' scale-105';
  } else if (isFinished) {
    animClass += ' animate-bounce';
  } else {
    animClass += ' animate-float';
  }

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${animClass}`}>
      {/* Nitro Flame Exhaust (Twin Turbos at Rear Left) */}
      {isMoving && (
        <div className="absolute -left-6 top-[55%] -translate-y-1/2 pointer-events-none flex items-center gap-1 z-0">
          <div
            className="w-8 h-3.5 rounded-full blur-[2px] animate-turbo"
            style={{
              background: `linear-gradient(to left, #ffffff, #f59e0b, ${theme.accentHex}, transparent)`,
              boxShadow: `0 0 14px ${theme.accentHex}`,
            }}
          />
          <div
            className="w-4 h-2 rounded-full blur-[1px] bg-white animate-turbo"
            style={{ animationDelay: '0.04s' }}
          />
        </div>
      )}

      {/* Headlight beam shining forward to the right when moving or correct */}
      {(isMoving || feedback === 'correct') && (
        <div
          className="absolute -right-10 top-[45%] -translate-y-1/2 w-14 h-8 pointer-events-none opacity-40 blur-sm z-0"
          style={{
            background: 'radial-gradient(ellipse at left, rgba(254,240,138,0.9), rgba(56,189,248,0.4), transparent 70%)',
            clipPath: 'polygon(0% 40%, 100% 0%, 100% 100%, 0% 60%)',
          }}
        />
      )}

      {/* Underglow Neon Lighting */}
      <div
        className="absolute bottom-1 left-2 right-2 h-4 rounded-full blur-md pointer-events-none transition-all duration-300"
        style={{
          backgroundColor: theme.accentHex,
          opacity: isFinished ? 0.9 : feedback === 'correct' ? 0.85 : isMoving ? 0.75 : 0.4,
          boxShadow: `0 0 16px ${theme.glowHex}`,
        }}
      />

      {/* SVG Racing Car Character */}
      <svg
        width={dim.width}
        height={dim.height}
        viewBox="0 0 130 65"
        className="relative z-10 filter drop-shadow-lg overflow-visible"
      >
        <defs>
          {/* Main Car Body Gradient */}
          <linearGradient id={`car-body-${theme.primary}`} x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="35%" stopColor={theme.accentHex} />
            <stop offset="75%" stopColor={theme.lightHex} />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>

          {/* Cockpit / Windshield Tint */}
          <linearGradient id="windshield-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#0f172a" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
          </linearGradient>

          {/* Alloy Rim Metallic Gradient */}
          <linearGradient id="rim-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="50%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          {/* Wheel spin keyframe style */}
          <style>
            {`
              @keyframes wheelSpin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              .spinning-wheel {
                transform-origin: center;
                animation: wheelSpin 0.35s linear infinite;
              }
            `}
          </style>
        </defs>

        {/* --- TIRE SHADOW ON TRACK --- */}
        <ellipse cx="65" cy="58" rx="55" ry="5.5" fill="#000000" opacity="0.6" />

        {/* --- REAR SPOILER / WING (Left side) --- */}
        {/* Spoiler Stanchions */}
        <path d="M 16 35 L 12 18 L 16 18 L 20 35 Z" fill="#0f172a" stroke="#334155" strokeWidth="0.8" />
        <path d="M 23 35 L 20 18 L 24 18 L 27 35 Z" fill="#0f172a" stroke="#334155" strokeWidth="0.8" />
        {/* Aerodynamic Wing Blade */}
        <path
          d="M 6 18 Q 20 14 30 18 L 28 22 Q 18 19 8 22 Z"
          fill={theme.accentHex}
          stroke="#ffffff"
          strokeWidth="1"
          style={{ filter: `drop-shadow(0 0 3px ${theme.accentHex})` }}
        />

        {/* --- EXHAUST PIPES (Rear Left) --- */}
        <rect x="7" y="44" width="8" height="4" rx="1.5" fill="#475569" stroke="#94a3b8" strokeWidth="0.8" />
        <rect x="8" y="49" width="7" height="3" rx="1" fill="#334155" />

        {/* --- MAIN CAR CHASSIS / BODY (Facing Right ->) --- */}
        {/* Aerodynamic Sports Silhouette */}
        <path
          d="
            M 12 47 
            L 12 36
            Q 14 32 24 33
            L 38 33
            Q 46 20 62 17
            L 80 18
            Q 94 22 98 33
            L 118 36
            Q 125 38 124 43
            L 122 47
            Q 115 48 108 48
            A 14 14 0 0 0 82 48
            L 48 48
            A 14 14 0 0 0 22 48
            Z
          "
          fill={`url(#car-body-${theme.primary})`}
          stroke={feedback === 'correct' ? '#4ade80' : feedback === 'wrong' ? '#f87171' : '#334155'}
          strokeWidth="1.8"
        />

        {/* Side Racing Skirt & Aero Trim */}
        <path
          d="M 36 47 L 80 47 L 82 44 L 34 44 Z"
          fill="#0f172a"
        />
        <line
          x1="35"
          y1="44"
          x2="81"
          y2="44"
          stroke={theme.lightHex}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* --- COCKPIT / WINDSHIELD & RACER HELMET --- */}
        <path
          d="M 44 32 Q 52 20 64 19 L 78 20 Q 88 23 92 32 Z"
          fill="url(#windshield-grad)"
          stroke="#0f172a"
          strokeWidth="1.2"
        />
        {/* Windshield Glare Reflection Line */}
        <path
          d="M 50 28 L 74 21"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.75"
        />

        {/* Racer Pilot / Helmet inside cockpit */}
        <circle cx="66" cy="25" r="5" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />
        {/* Helmet Visor */}
        <path
          d="M 66 23 Q 71 24 71 27 L 66 27 Z"
          fill={theme.accentHex}
        />

        {/* --- RACING DOOR BADGE & NUMBER DECAL --- */}
        <g transform="translate(52, 31)">
          {/* Round Racing Number Circle */}
          <circle cx="9" cy="8" r="7.5" fill="#ffffff" stroke="#0f172a" strokeWidth="1.2" />
          <text
            x="9"
            y="11.5"
            textAnchor="middle"
            fill="#0f172a"
            fontSize="10"
            fontWeight="900"
            fontFamily="'Chakra Petch', sans-serif"
          >
            {pNum}
          </text>
        </g>

        {/* Front Headlight Housing (Right) */}
        <path
          d="M 112 36 L 122 39 L 118 42 L 110 40 Z"
          fill="#fef08a"
          stroke="#eab308"
          strokeWidth="0.8"
          style={{ filter: 'drop-shadow(0 0 4px #fef08a)' }}
        />
        {/* LED Headlight Bulb */}
        <circle cx="118" cy="40" r="2" fill="#ffffff" />

        {/* Rear Taillight (Left) */}
        <rect
          x="11"
          y="37"
          width="3.5"
          height="7"
          rx="1"
          fill="#ef4444"
          style={{ filter: 'drop-shadow(0 0 3px #ef4444)' }}
        />

        {/* --- WHEELS (TIRES & RIMS) --- */}
        {/* 1. REAR WHEEL (cx=29, cy=48) */}
        <g transform="translate(29, 48)">
          {/* Tire Rubber */}
          <circle cx="0" cy="0" r="11" fill="#090d16" stroke="#334155" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="8" fill="#1e293b" />
          {/* Rim with Spokes */}
          <g className={isMoving ? 'spinning-wheel' : ''}>
            <circle cx="0" cy="0" r="6" fill="url(#rim-grad)" />
            {/* 5-Spoke Sport Design */}
            <line x1="0" y1="-6" x2="0" y2="6" stroke="#f8fafc" strokeWidth="1.5" />
            <line x1="-5.7" y1="-1.8" x2="5.7" y2="1.8" stroke="#f8fafc" strokeWidth="1.5" />
            <line x1="-3.5" y1="4.8" x2="3.5" y2="-4.8" stroke="#f8fafc" strokeWidth="1.5" />
            {/* Center Cap with Player Color */}
            <circle cx="0" cy="0" r="2" fill={theme.accentHex} />
          </g>
        </g>

        {/* 2. FRONT WHEEL (cx=95, cy=48) */}
        <g transform="translate(95, 48)">
          {/* Tire Rubber */}
          <circle cx="0" cy="0" r="11" fill="#090d16" stroke="#334155" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="8" fill="#1e293b" />
          {/* Rim with Spokes */}
          <g className={isMoving ? 'spinning-wheel' : ''}>
            <circle cx="0" cy="0" r="6" fill="url(#rim-grad)" />
            {/* 5-Spoke Sport Design */}
            <line x1="0" y1="-6" x2="0" y2="6" stroke="#f8fafc" strokeWidth="1.5" />
            <line x1="-5.7" y1="-1.8" x2="5.7" y2="1.8" stroke="#f8fafc" strokeWidth="1.5" />
            <line x1="-3.5" y1="4.8" x2="3.5" y2="-4.8" stroke="#f8fafc" strokeWidth="1.5" />
            {/* Center Cap with Player Color */}
            <circle cx="0" cy="0" r="2" fill={theme.accentHex} />
          </g>
        </g>

        {/* --- FINISH TROPHY/CROWN OVER CAR --- */}
        {isFinished && (
          <g transform="translate(53, -2)">
            <path
              d="M 0 12 L 6 2 L 12 9 L 18 2 L 24 12 Z"
              fill="#fbbf24"
              stroke="#d97706"
              strokeWidth="1.5"
            />
            <circle cx="6" cy="3" r="1.5" fill="#fef08a" />
            <circle cx="12" cy="9" r="1.5" fill="#fef08a" />
            <circle cx="18" cy="3" r="1.5" fill="#fef08a" />
          </g>
        )}
      </svg>

      {/* Optional Player Badge */}
      {showLabel && (
        <div className="mt-1 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-700/60 shadow-sm text-xs font-race">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accentHex }} />
          <span className="font-bold text-slate-200">{playerName}</span>
          {score !== undefined && (
            <span className="text-amber-400 font-extrabold ml-1">{score} pt</span>
          )}
        </div>
      )}
    </div>
  );
};
