/**
 * COMPUTER RACE – GERAK LURUS (GLB & GLBB)
 * Interactive Educational Racing Game for SMP Physics
 * Designed specifically for Interactive Flat Panels (IFP) / Touchscreens
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { GameSettings, PlayerState, Question } from './types/game';
import { QUESTION_BANK } from './data/questions';
import { PLAYER_THEMES } from './data/playerThemes';
import { RaceTrack } from './components/RaceTrack';
import { PlayerStation } from './components/PlayerStation';
import { StartMenu } from './components/StartMenu';
import { ResultsScreen } from './components/ResultsScreen';
import { SoundPrompt } from './components/SoundPrompt';
import { sound } from './utils/audio';
import { RotateCcw, Volume2, VolumeX, Home, Award, Sparkles } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<'menu' | 'racing' | 'results'>('menu');
  const [settings, setSettings] = useState<GameSettings>({
    playerCount: 3,
    targetQuestions: 7,
    materialMode: 'all',
    soundEnabled: true,
  });

  const [players, setPlayers] = useState<PlayerState[]>([]);
  const [finishCounter, setFinishCounter] = useState<number>(0);

  // Filter pool based on material settings
  const filteredQuestionPool = useMemo(() => {
    if (settings.materialMode === 'glb') {
      return QUESTION_BANK.filter((q) => q.topic === 'GLB');
    }
    if (settings.materialMode === 'glbb') {
      return QUESTION_BANK.filter((q) => q.topic === 'GLBB');
    }
    return QUESTION_BANK;
  }, [settings.materialMode]);

  // Helper to pick a distinct question not currently active on ANY player's screen
  const pickDistinctQuestion = useCallback(
    (
      usedIds: string[],
      activeQuestionIds: string[]
    ): Question => {
      // 1. Prefer questions not used yet by this player AND not active on other players' screens
      let candidates = filteredQuestionPool.filter(
        (q) => !usedIds.includes(q.id) && !activeQuestionIds.includes(q.id)
      );

      // 2. If exhausted, pick any question not currently displayed on other screens
      if (candidates.length === 0) {
        candidates = filteredQuestionPool.filter(
          (q) => !activeQuestionIds.includes(q.id)
        );
      }

      // 3. Fallback: random from pool
      if (candidates.length === 0) {
        candidates = filteredQuestionPool;
      }

      const randomIndex = Math.floor(Math.random() * candidates.length);
      return candidates[randomIndex];
    },
    [filteredQuestionPool]
  );

  // Initialize or Reset Game
  const startNewRace = useCallback(() => {
    sound.playTurbo();
    setFinishCounter(0);

    const activeQuestionIds: string[] = [];
    const initialPlayers: PlayerState[] = [];

    for (let i = 0; i < settings.playerCount; i++) {
      const q = pickDistinctQuestion([], activeQuestionIds);
      activeQuestionIds.push(q.id);

      initialPlayers.push({
        id: i + 1,
        name: `Pemain ${i + 1}`,
        colorTheme: PLAYER_THEMES[i % PLAYER_THEMES.length],
        score: 0,
        correctCount: 0,
        wrongCount: 0,
        progress: 0,
        isFinished: false,
        currentQuestion: q,
        usedQuestionIds: [q.id],
        feedback: 'idle',
        isMoving: false,
        streak: 0,
      });
    }

    setPlayers(initialPlayers);
    setGameState('racing');
  }, [settings.playerCount, pickDistinctQuestion]);

  // Handle Player Answering
  const handlePlayerAnswer = (playerId: number, selectedKey: 'A' | 'B' | 'C' | 'D') => {
    setPlayers((prevPlayers) => {
      const playerIndex = prevPlayers.findIndex((p) => p.id === playerId);
      if (playerIndex === -1) return prevPlayers;

      const player = prevPlayers[playerIndex];
      if (player.isFinished || player.feedback !== 'idle') return prevPlayers;

      const isCorrect = selectedKey === player.currentQuestion.correctAnswer;

      if (isCorrect) {
        sound.playCorrect();
        sound.playTurbo();

        const stepPercentage = 100 / settings.targetQuestions;
        const newProgress = Math.min(100, player.progress + stepPercentage);
        const newScore = player.score + 100;
        const newCorrectCount = player.correctCount + 1;
        const newStreak = player.streak + 1;
        const willFinish = newProgress >= 100;

        let rankToAssign = player.finishRank;
        if (willFinish && !player.isFinished) {
          rankToAssign = finishCounter + 1;
          setFinishCounter((prev) => prev + 1);
          sound.playFinish();
        }

        // Updated player with correct state & movement
        const updatedPlayer: PlayerState = {
          ...player,
          score: newScore,
          correctCount: newCorrectCount,
          progress: newProgress,
          feedback: 'correct',
          isMoving: true,
          streak: newStreak,
          isFinished: willFinish,
          finishRank: rankToAssign,
        };

        const nextPlayers = [...prevPlayers];
        nextPlayers[playerIndex] = updatedPlayer;

        // Schedule automated question transition after movement animation
        setTimeout(() => {
          setPlayers((currentPlayers) => {
            const idx = currentPlayers.findIndex((p) => p.id === playerId);
            if (idx === -1) return currentPlayers;

            const p = currentPlayers[idx];
            if (p.isFinished) {
              return currentPlayers.map((item) =>
                item.id === playerId ? { ...item, isMoving: false, feedback: 'idle' } : item
              );
            }

            // Gather currently active question IDs from other players so we don't duplicate
            const activeIds = currentPlayers
              .filter((other) => other.id !== playerId)
              .map((other) => other.currentQuestion.id);

            const nextQ = pickDistinctQuestion(p.usedQuestionIds, activeIds);

            return currentPlayers.map((item) =>
              item.id === playerId
                ? {
                    ...item,
                    currentQuestion: nextQ,
                    usedQuestionIds: [...item.usedQuestionIds, nextQ.id],
                    feedback: 'idle',
                    isMoving: false,
                  }
                : item
            );
          });
        }, 750);

        return nextPlayers;
      } else {
        // Wrong Answer: stay put, shake animation, sound
        sound.playWrong();

        const updatedPlayer: PlayerState = {
          ...player,
          wrongCount: player.wrongCount + 1,
          feedback: 'wrong',
          isMoving: false,
          streak: 0,
        };

        const nextPlayers = [...prevPlayers];
        nextPlayers[playerIndex] = updatedPlayer;

        // Clear feedback after shake animation so player can try again
        setTimeout(() => {
          setPlayers((currentPlayers) =>
            currentPlayers.map((item) =>
              item.id === playerId && item.feedback === 'wrong'
                ? { ...item, feedback: 'idle' }
                : item
            )
          );
        }, 700);

        return nextPlayers;
      }
    });
  };

  // Check if all players have completed the race
  useEffect(() => {
    if (gameState === 'racing' && players.length > 0) {
      const allFinished = players.every((p) => p.isFinished);
      if (allFinished) {
        const timer = setTimeout(() => {
          setGameState('results');
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [players, gameState]);

  // Toggle Sound
  const toggleSound = () => {
    sound.enabled = !settings.soundEnabled;
    if (sound.enabled) {
      sound.unlock();
      sound.playClick();
    }
    setSettings((prev) => ({ ...prev, soundEnabled: sound.enabled }));
  };

  // Render Current View
  if (gameState === 'menu') {
    return (
      <>
        <StartMenu
          settings={settings}
          onUpdateSettings={setSettings}
          onStartGame={startNewRace}
        />
        <SoundPrompt />
      </>
    );
  }

  if (gameState === 'results') {
    return (
      <>
        <ResultsScreen
          players={players}
          onPlayAgain={startNewRace}
          onBackToMenu={() => setGameState('menu')}
        />
        <SoundPrompt />
      </>
    );
  }

  // Active Racing View
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-2 sm:p-4 md:p-6 select-none overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(14,165,233,0.12),rgba(255,255,255,0))] pointer-events-none" />

      {/* Main Header Bar */}
      <header className="relative z-20 flex flex-wrap items-center justify-between gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md mb-3">
        {/* Game Title & Topic */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-lg shadow-md font-race">
            🏎️
          </div>
          <div>
            <h1 className="font-race font-black text-sm sm:text-base md:text-lg text-slate-100 tracking-wide flex items-center gap-2">
              <span>CAR RACE</span>
              <span className="text-amber-400 font-bold text-xs sm:text-sm">
                · GERAK LURUS (GLB • GLBB)
              </span>
            </h1>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="text-cyan-400 font-bold">
                {players.length} Pemain
              </span>
              <span>·</span>
              <span>Target: {settings.targetQuestions} Soal Benar</span>
              {finishCounter > 0 && (
                <>
                  <span>·</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                    <Sparkles className="w-3 h-3" />
                    {finishCounter} Finish
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Control Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 text-slate-300 text-xs font-race font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            title="Pengaturan Suara"
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
            <span className="hidden sm:inline">
              {settings.soundEnabled ? 'SUARA ON' : 'SUARA OFF'}
            </span>
          </button>

          {/* Reset Button (Prompt #25: FITUR RESET) */}
          <button
            onClick={() => {
              if (window.confirm('Mulai ulang balapan dari garis START?')) {
                startNewRace();
              }
            }}
            className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 text-amber-300 hover:text-amber-200 text-xs font-race font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-md"
            title="Reset Game ke Start"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            <span>RESET</span>
          </button>

          {/* Selesaikan & Lihat Podium (if at least 1 player finished or teacher wants to evaluate) */}
          {finishCounter > 0 && (
            <button
              onClick={() => {
                sound.playClick();
                setGameState('results');
              }}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-race font-black transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-lg animate-pulse"
            >
              <Award className="w-4 h-4" />
              <span>LIHAT HASIL</span>
            </button>
          )}

          {/* Back to Menu */}
          <button
            onClick={() => {
              sound.playClick();
              setGameState('menu');
            }}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 text-slate-300 text-xs font-race font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            title="Kembali ke Menu Utama"
          >
            <Home className="w-4 h-4" />
            <span className="hidden md:inline">MENU</span>
          </button>
        </div>
      </header>

      {/* RACE TRACK COMPONENT (Top half) */}
      <section className="relative z-10 w-full mb-3 sm:mb-4">
        <RaceTrack players={players} />
      </section>

      {/* QUESTION STATIONS FOR PLAYERS (Bottom half) */}
      <section className="relative z-10 w-full flex-1 flex flex-col justify-end">
        {/* Dynamic Responsive Grid for 2, 3, 4, 5 Players */}
        <div
          className={`grid gap-2.5 sm:gap-3.5 w-full ${
            players.length === 2
              ? 'grid-cols-1 md:grid-cols-2'
              : players.length === 3
              ? 'grid-cols-1 md:grid-cols-3'
              : players.length === 4
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
          }`}
        >
          {players.map((player) => (
            <PlayerStation
              key={player.id}
              player={player}
              onAnswer={handlePlayerAnswer}
              totalPlayers={players.length}
            />
          ))}
        </div>
      </section>

      {/* Autoplay Audio Safety Prompt */}
      <SoundPrompt />
    </div>
  );
}
