import React, { useState } from 'react';
import { PlayerState } from '../types/game';
import { CarAvatar } from './CarAvatar';
import { GraphViewer } from './GraphViewer';
import { CheckCircle2, XCircle, Award, Sparkles } from 'lucide-react';

interface PlayerStationProps {
  player: PlayerState;
  onAnswer: (playerId: number, selectedKey: 'A' | 'B' | 'C' | 'D') => void;
  totalPlayers: number;
}

export const PlayerStation: React.FC<PlayerStationProps> = ({
  player,
  onAnswer,
  totalPlayers,
}) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const theme = player.colorTheme;
  const question = player.currentQuestion;

  const handleSelect = (key: 'A' | 'B' | 'C' | 'D') => {
    if (player.isFinished || player.feedback !== 'idle') return;
    setSelectedKey(key);
    onAnswer(player.id, key);
    setTimeout(() => {
      setSelectedKey(null);
    }, 600);
  };

  // Compact mode for 4-5 players to fit well on IFP touchscreen
  const isCompact = totalPlayers >= 4;

  return (
    <div
      className={`relative flex flex-col justify-between rounded-2xl p-3 sm:p-4 border-2 transition-all duration-300 shadow-xl overflow-hidden backdrop-blur-md ${
        player.feedback === 'correct'
          ? 'border-emerald-400 bg-emerald-950/40 shadow-emerald-500/20'
          : player.feedback === 'wrong'
          ? 'border-rose-500 bg-rose-950/40 shadow-rose-500/20'
          : 'border-slate-800 bg-slate-900/95 hover:border-slate-700'
      }`}
      style={{
        boxShadow:
          player.feedback === 'correct'
            ? '0 0 25px rgba(16, 185, 129, 0.35)'
            : player.feedback === 'wrong'
            ? '0 0 25px rgba(244, 63, 94, 0.35)'
            : `0 8px 24px -6px ${theme.glowHex}`,
      }}
    >
      {/* Station Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          {/* Mini Car Avatar */}
          <div className="shrink-0 scale-90">
            <CarAvatar
              theme={theme}
              playerName={player.name}
              playerNumber={player.id}
              feedback={player.feedback}
              isMoving={player.isMoving}
              isFinished={player.isFinished}
              score={player.score}
              size="sm"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: theme.accentHex }}
              />
              <h3 className="font-race font-extrabold text-sm sm:text-base text-slate-100 tracking-wide">
                {player.name}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span className="text-amber-400 font-extrabold flex items-center gap-0.5">
                ⭐ {player.score} pt
              </span>
              <span>·</span>
              <span className="text-slate-300">
                Laju: {Math.round(player.progress)}%
              </span>
            </div>
          </div>
        </div>

        {/* Cognitive & Topic Badge */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 font-race">
            <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
              {question.topic}
            </span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
              {question.cognitiveLevel}
            </span>
          </div>
          {player.streak > 1 && (
            <div className="text-[10px] font-extrabold text-amber-400 flex items-center gap-0.5 animate-pulse">
              <Sparkles className="w-3 h-3" />
              <span>{player.streak}x Kombo!</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Body: Question + Graph + Options */}
      {player.isFinished ? (
        /* Finished State View */
        <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 mb-3 animate-bounce">
            <Award className="w-8 h-8" />
          </div>
          <h4 className="font-race font-black text-xl text-amber-300 mb-1">
            FINISH! JUARA {player.finishRank}
          </h4>
          <p className="text-xs text-slate-300 max-w-xs">
            Hebat! Mobil balapmu berhasil melewati garis finish dengan skor akhir{' '}
            <strong className="text-amber-400">{player.score} poin</strong>!
          </p>
          <div className="mt-4 px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-400 font-medium">
            Menunggu pemain lain menyelesaikan lintasan...
          </div>
        </div>
      ) : (
        /* Active Question View */
        <div className="flex-1 flex flex-col justify-between">
          {/* Question Text */}
          <div className="mb-2">
            <p className={`font-semibold text-slate-100 leading-snug ${isCompact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'}`}>
              {question.text}
            </p>
          </div>

          {/* Graph (if question is graph-based) */}
          {question.graph && (
            <div className="w-full">
              <GraphViewer graph={question.graph} />
            </div>
          )}

          {/* Answer Feedback Banner */}
          {player.feedback === 'correct' && (
            <div className="my-1.5 py-1 px-2.5 rounded-lg bg-emerald-500/25 border border-emerald-400 text-emerald-300 flex items-center justify-center gap-1.5 font-race font-black text-xs sm:text-sm animate-pulse">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>✓ BENAR! MOBIL MELAJU! (+100)</span>
            </div>
          )}

          {player.feedback === 'wrong' && (
            <div className="my-1.5 py-1 px-2.5 rounded-lg bg-rose-500/25 border border-rose-400 text-rose-300 flex items-center justify-center gap-1.5 font-race font-black text-xs sm:text-sm animate-shake">
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>BELUM TEPAT! COBA LAGI!</span>
            </div>
          )}

          {/* Multiple Choice Options (Large touch targets for IFP) */}
          <div
            className={`grid gap-2 mt-2 ${
              isCompact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'
            }`}
          >
            {question.options.map((opt) => {
              const isChosen = selectedKey === opt.key;
              const isLocked = player.feedback !== 'idle';

              return (
                <button
                  key={opt.key}
                  disabled={isLocked}
                  onClick={() => handleSelect(opt.key)}
                  className={`relative flex items-center gap-2.5 text-left p-2.5 sm:p-3 rounded-xl border font-medium transition-all duration-150 active:scale-95 touch-manipulation cursor-pointer ${
                    isChosen && player.feedback === 'correct'
                      ? 'bg-emerald-600 text-white border-emerald-300 shadow-lg shadow-emerald-500/30'
                      : isChosen && player.feedback === 'wrong'
                      ? 'bg-rose-600 text-white border-rose-300 shadow-lg shadow-rose-500/30'
                      : 'bg-slate-800/90 hover:bg-slate-700/90 active:bg-slate-600 border-slate-700/80 text-slate-100 hover:border-slate-500'
                  }`}
                  style={{
                    minHeight: isCompact ? '48px' : '56px',
                  }}
                >
                  {/* Option Badge A, B, C, D */}
                  <span
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-race font-black text-xs sm:text-sm shrink-0 border ${
                      isChosen && player.feedback === 'correct'
                        ? 'bg-white text-emerald-700 border-white'
                        : isChosen && player.feedback === 'wrong'
                        ? 'bg-white text-rose-700 border-white'
                        : 'bg-slate-900 text-cyan-400 border-slate-700 group-hover:border-cyan-400'
                    }`}
                  >
                    {opt.key}
                  </span>

                  {/* Option Text */}
                  <span className={`text-xs sm:text-sm leading-tight flex-1 ${isCompact ? 'line-clamp-2' : ''}`}>
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
