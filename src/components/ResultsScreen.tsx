import React, { useEffect } from 'react';
import { PlayerState } from '../types/game';
import { CarAvatar } from './CarAvatar';
import { Trophy, RotateCcw, Home, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface ResultsScreenProps {
  players: PlayerState[];
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  players,
  onPlayAgain,
  onBackToMenu,
}) => {
  // Sort players by:
  // 1. Finished status (finished first)
  // 2. Finish rank if finished
  // 3. Score desc
  // 4. Progress desc
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.isFinished && !b.isFinished) return -1;
    if (!a.isFinished && b.isFinished) return 1;
    if (a.isFinished && b.isFinished) {
      return (a.finishRank ?? 99) - (b.finishRank ?? 99);
    }
    if (b.score !== a.score) return b.score - a.score;
    return b.progress - a.progress;
  });

  const winner = sortedPlayers[0];

  useEffect(() => {
    sound.playFinish();

    // Trigger celebratory confetti burst
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#a855f7', '#fbbf24'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8 relative select-none">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_0%,rgba(245,158,11,0.2),rgba(255,255,255,0))] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 text-center max-w-4xl mx-auto w-full pt-2 pb-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-race font-bold text-xs uppercase tracking-widest mb-2 shadow-lg">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>GARIS FINISH TERCAPAI!</span>
        </div>
        <h1 className="font-race font-black text-3xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 tracking-tight">
          🏁 HASIL AKHIR BALAPAN 🏁
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Selamat kepada seluruh pembalap atas usahanya dalam memahami Gerak Lurus (GLB & GLBB)!
        </p>
      </header>

      {/* Main Podium & Cards */}
      <main className="relative z-10 max-w-5xl mx-auto w-full my-auto py-4">
        {/* Champion Spotlight Banner */}
        {winner && (
          <div className="mb-6 p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border-2 border-amber-400/60 shadow-[0_0_35px_rgba(245,158,11,0.25)] flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
            <div className="relative">
              <CarAvatar
                theme={winner.colorTheme}
                playerName={winner.name}
                playerNumber={winner.id}
                isFinished={true}
                score={winner.score}
                size="lg"
              />
              <div className="absolute -top-3 -right-2 bg-amber-400 text-slate-950 font-race font-black px-2 py-0.5 rounded-full text-xs shadow-md">
                🏆 JUARA 1
              </div>
            </div>

            <div>
              <div className="text-xs uppercase font-race font-extrabold text-amber-300 tracking-widest flex items-center justify-center sm:justify-start gap-1">
                <Sparkles className="w-4 h-4" />
                <span>Pemenang Utama Balapan</span>
              </div>
              <h2 className="font-race font-black text-2xl sm:text-3xl text-slate-100">
                {winner.name}
              </h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1.5 text-xs text-slate-300">
                <span className="font-extrabold text-amber-400 text-sm">
                  ⭐ Skor: {winner.score} Poin
                </span>
                <span>·</span>
                <span className="text-emerald-400 font-bold">
                  ✓ Benar: {winner.correctCount} Soal
                </span>
                <span>·</span>
                <span className="text-slate-400">
                  Kemajuan: {Math.round(winner.progress)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Players Grid Showcase (Visual Computer + Score + Progress) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {sortedPlayers.map((player, index) => {
            const rank = index + 1;
            const theme = player.colorTheme;

            return (
              <div
                key={player.id}
                className="relative rounded-2xl p-4 bg-slate-900/90 border-2 border-slate-800 shadow-xl flex items-center gap-4 overflow-hidden backdrop-blur-md transition-all hover:border-slate-700"
                style={{
                  boxShadow: rank === 1 ? '0 0 20px rgba(245, 158, 11, 0.25)' : 'none',
                }}
              >
                {/* Rank Badge */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-race font-black text-sm shrink-0 border shadow-md ${
                    rank === 1
                      ? 'bg-amber-400 text-slate-950 border-amber-300'
                      : rank === 2
                      ? 'bg-slate-300 text-slate-950 border-white'
                      : rank === 3
                      ? 'bg-amber-700 text-amber-100 border-amber-600'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  #{rank}
                </div>

                {/* Car Character */}
                <div className="shrink-0 scale-90">
                  <CarAvatar
                    theme={theme}
                    playerName={player.name}
                    playerNumber={player.id}
                    isFinished={player.isFinished}
                    score={player.score}
                    size="sm"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: theme.accentHex }}
                    />
                    <h3 className="font-race font-bold text-sm truncate text-slate-100">
                      {player.name}
                    </h3>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden border border-slate-700/50">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(0, player.progress))}%`,
                        backgroundColor: theme.accentHex,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-1.5 text-xs">
                    <span className="font-extrabold text-amber-400">
                      {player.score} pt
                    </span>
                    <span className="font-bold text-slate-400 text-[11px]">
                      {player.isFinished ? '🏁 FINISH' : `${Math.round(player.progress)}%`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Action Buttons */}
      <footer className="relative z-10 max-w-lg mx-auto w-full pt-4 pb-2 flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={() => {
            sound.playClick();
            onPlayAgain();
          }}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-race font-black text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5 stroke-[2.5]" />
          <span>MAIN LAGI</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onBackToMenu();
          }}
          className="w-full py-4 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 text-slate-200 font-race font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Home className="w-5 h-5" />
          <span>KEMBALI KE MENU</span>
        </button>
      </footer>
    </div>
  );
};
