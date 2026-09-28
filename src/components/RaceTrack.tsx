import React from 'react';
import { PlayerState } from '../types/game';
import { CarAvatar } from './CarAvatar';
import { Flag, Trophy } from 'lucide-react';

interface RaceTrackProps {
  players: PlayerState[];
}

export const RaceTrack: React.FC<RaceTrackProps> = ({ players }) => {
  return (
    <div className="w-full bg-slate-900/90 border-2 border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Top Track Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 text-xs font-race font-bold">
        <div className="flex items-center gap-2 text-cyan-400">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="tracking-wider uppercase">LINTASAN BALAP MOBIL (GLB • GLBB)</span>
        </div>
        <div className="flex items-center gap-6 text-slate-400">
          <span className="text-emerald-400 flex items-center gap-1">
            🟢 START (0%)
          </span>
          <span className="hidden sm:inline text-slate-500">25%</span>
          <span className="hidden sm:inline text-slate-500">50%</span>
          <span className="hidden sm:inline text-slate-500">75%</span>
          <span className="text-amber-400 flex items-center gap-1">
            <Flag className="w-3.5 h-3.5" /> FINISH (100%)
          </span>
        </div>
      </div>

      {/* Track Surface & Lanes */}
      <div className="relative p-2 sm:p-3 bg-slate-950/70">
        {/* Curbs top */}
        <div className="w-full h-1.5 track-curb rounded-full mb-1 opacity-80" />

        {/* Lanes container */}
        <div className="flex flex-col gap-2 relative">
          {/* Vertical Grid Markers */}
          <div className="absolute inset-0 pointer-events-none flex justify-between px-16 sm:px-24 opacity-15">
            <div className="border-r border-dashed border-slate-400 h-full" />
            <div className="border-r border-dashed border-slate-400 h-full" />
            <div className="border-r border-dashed border-slate-400 h-full" />
          </div>

          {players.map((player, idx) => {
            const laneNumber = idx + 1;
            const theme = player.colorTheme;
            // Progress percentage capped 0 to 100
            const progress = Math.min(100, Math.max(0, player.progress));

            return (
              <div
                key={player.id}
                className="relative h-14 sm:h-16 rounded-xl flex items-center bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 shadow-inner group overflow-hidden"
              >
                {/* Asphalt Lane markings */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                  <div className="w-full h-full border-b border-dashed border-slate-600" />
                </div>

                {/* Left: START Post & Player Identity */}
                <div className="relative z-20 flex items-center gap-2 pl-2 sm:pl-3 pr-2 w-28 sm:w-36 shrink-0 bg-slate-900/95 border-r border-slate-700/80 h-full">
                  {/* Lane Badge */}
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center font-race font-extrabold text-xs shadow-md"
                    style={{
                      backgroundColor: theme.accentHex,
                      color: '#020617',
                    }}
                  >
                    #{laneNumber}
                  </div>

                  {/* Player Name and Score */}
                  <div className="flex flex-col min-w-0">
                    <span className="font-race font-bold text-xs truncate text-slate-100">
                      {player.name}
                    </span>
                    <span className="text-[11px] font-extrabold text-amber-400">
                      {player.score} pt
                    </span>
                  </div>
                </div>

                {/* Track Racing Area (Left: 0% -> Right: 100%) */}
                <div className="relative flex-1 h-full mx-2">
                  {/* Start Line Marker */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500/60 z-10" />

                  {/* Finish Line Checkered Strip */}
                  <div className="absolute right-0 top-0 bottom-0 w-5 sm:w-7 finish-line-pattern border-l-2 border-slate-900 z-10 shadow-lg">
                    {/* Finish Pole Flag */}
                    <div className="absolute -top-1.5 right-0.5 text-black">
                      <Flag className="w-3.5 h-3.5 fill-black stroke-white" />
                    </div>
                  </div>

                  {/* Computer Character Container with physics glide */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 z-20 will-change-transform"
                    style={{
                      /* Calculate left position: offset so it doesn't clip off the right edge at 100% */
                      left: `calc(${progress}% * 0.88)`,
                      transition: 'left 0.75s cubic-bezier(0.34, 1.35, 0.64, 1)',
                    }}
                  >
                    <div className="relative flex items-center">
                      <CarAvatar
                        theme={theme}
                        playerName={player.name}
                        playerNumber={laneNumber}
                        isMoving={player.isMoving}
                        feedback={player.feedback}
                        isFinished={player.isFinished}
                        score={player.score}
                        size="sm"
                      />

                      {/* Floating progress tooltip or FINISH badge */}
                      {player.isFinished ? (
                        <div className="absolute -top-6 -right-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-race font-extrabold px-2 py-0.5 rounded-full text-[10px] shadow-lg flex items-center gap-1 animate-bounce">
                          <Trophy className="w-3 h-3" />
                          <span>JUARA {player.finishRank ?? ''}!</span>
                        </div>
                      ) : (
                        <div
                          className="absolute -top-5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded text-[10px] font-race font-bold text-white shadow-sm pointer-events-none"
                          style={{ backgroundColor: `${theme.accentHex}cc` }}
                        >
                          {Math.round(progress)}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rightmost Finish Rank or Status */}
                <div className="relative z-20 pr-3 pl-1 w-14 shrink-0 flex items-center justify-center font-race font-bold text-xs h-full bg-slate-900/90 border-l border-slate-800">
                  {player.isFinished ? (
                    <span className="text-amber-400 flex items-center gap-1 font-black">
                      🏁 #{player.finishRank}
                    </span>
                  ) : (
                    <span className="text-slate-500 text-[11px]">
                      {Math.round(progress)}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Curbs bottom */}
        <div className="w-full h-1.5 track-curb rounded-full mt-2 opacity-80" />
      </div>
    </div>
  );
};
