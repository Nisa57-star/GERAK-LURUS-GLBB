import React, { useState } from 'react';
import { GameSettings } from '../types/game';
import { PLAYER_THEMES } from '../data/playerThemes';
import { CarAvatar } from './CarAvatar';
import { Play, Settings2, Volume2, VolumeX, Sparkles, BookOpen, Users, Compass } from 'lucide-react';
import { sound } from '../utils/audio';

interface StartMenuProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onStartGame: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  settings,
  onUpdateSettings,
  onStartGame,
}) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const setPlayerCount = (count: 2 | 3 | 4 | 5) => {
    sound.playClick();
    onUpdateSettings({ ...settings, playerCount: count });
  };

  const toggleSound = () => {
    sound.enabled = !settings.soundEnabled;
    if (sound.enabled) {
      sound.unlock();
      sound.playClick();
    }
    onUpdateSettings({ ...settings, soundEnabled: sound.enabled });
  };

  const handleStart = () => {
    sound.unlock();
    sound.playTurbo();
    onStartGame();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden select-none">
      {/* Background Cyber Grid & Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.25),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Top Bar with Audio & Settings */}
      <header className="relative z-10 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-race font-bold tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            IPA SMP · FISIKA GERAK LURUS
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold font-race transition-all active:scale-95 cursor-pointer ${
              settings.soundEnabled
                ? 'bg-slate-800/80 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{settings.soundEnabled ? 'SUARA: AKTIF' : 'SUARA: NONAKTIF'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setShowSettingsModal(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 active:bg-slate-600 border border-slate-700 text-slate-200 text-xs font-bold font-race transition-all active:scale-95 cursor-pointer"
          >
            <Settings2 className="w-4 h-4 text-cyan-400" />
            <span>PENGATURAN</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto w-full my-auto flex flex-col items-center text-center py-6">
        {/* Title Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/70 text-slate-300 text-xs sm:text-sm font-semibold mb-4 shadow-xl">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Game Edukatif Touchscreen untuk Layar IFP / PID</span>
        </div>

        {/* Main Logo & Title */}
        <h1 className="font-race font-black text-4xl sm:text-6xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-indigo-300 tracking-tight drop-shadow-[0_0_35px_rgba(56,189,248,0.4)]">
          CAR RACE
        </h1>
        <h2 className="font-race font-bold text-xl sm:text-2xl md:text-3xl text-amber-400 mt-2 tracking-widest flex items-center justify-center gap-3">
          <span className="h-0.5 w-8 sm:w-16 bg-gradient-to-r from-transparent to-amber-400" />
          GERAK LURUS (GLB • GLBB)
          <span className="h-0.5 w-8 sm:w-16 bg-gradient-to-l from-transparent to-amber-400" />
        </h2>

        {/* Racing Cars Lineup Preview */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 my-6 sm:my-8 p-4 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md shadow-2xl">
          {PLAYER_THEMES.slice(0, settings.playerCount).map((theme, i) => (
            <div key={theme.name} className="flex flex-col items-center">
              <CarAvatar
                theme={theme}
                playerName={`P${i + 1}`}
                playerNumber={i + 1}
                size="md"
              />
              <span className="mt-1 font-race font-bold text-xs text-slate-300">
                Pemain {i + 1}
              </span>
            </div>
          ))}
        </div>

        {/* PLAYER COUNT SELECTOR (2 - 5 PLAYERS) */}
        <div className="w-full max-w-xl bg-slate-900/90 border-2 border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md mb-6">
          <div className="flex items-center justify-center gap-2 mb-3 text-cyan-400 font-race font-extrabold text-sm sm:text-base">
            <Users className="w-4 h-4" />
            <span>PILIH JUMLAH PEMAIN:</span>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {([2, 3, 4, 5] as const).map((count) => {
              const isSelected = settings.playerCount === count;
              return (
                <button
                  key={count}
                  onClick={() => setPlayerCount(count)}
                  className={`py-3 sm:py-4 px-2 rounded-xl font-race font-black text-sm sm:text-lg transition-all active:scale-95 cursor-pointer border-2 flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.5)] scale-105'
                      : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <span>{count} PLAYER</span>
                  <span className={`text-[10px] font-bold ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                    {count} Lintasan
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Mode & Target Summary */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-400 font-medium mb-6">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Materi: <strong className="text-slate-200 uppercase">{settings.materialMode === 'all' ? 'Campuran (GLB & GLBB)' : settings.materialMode.toUpperCase()}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Jarak Balapan: <strong className="text-slate-200">{settings.targetQuestions} Soal Benar (Finish)</strong></span>
          </div>
        </div>

        {/* BIG START BUTTON (Optimized for Touchscreen IFP) */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
          <button
            onClick={handleStart}
            className="w-full py-4 sm:py-5 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 font-race font-black text-xl sm:text-2xl shadow-[0_0_30px_rgba(16,185,129,0.45)] hover:shadow-[0_0_40px_rgba(16,185,129,0.65)] transition-all active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
          >
            <Play className="w-7 h-7 fill-slate-950" />
            <span>MULAI BALAPAN!</span>
          </button>
        </div>
      </main>

      {/* Footer Instructions for Teachers & Students */}
      <footer className="relative z-10 max-w-4xl mx-auto w-full text-center text-xs text-slate-500">
        <p>
          Petunjuk: Setiap pemain berdiri di depan stasiun layar IFP masing-masing. Jawab soal dengan benar agar mobil balapmu melaju ke garis finish!
        </p>
      </footer>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-cyan-400" />
                <h3 className="font-race font-bold text-lg text-slate-100">
                  PENGATURAN PERMAINAN
                </h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-800 text-sm font-bold cursor-pointer"
              >
                ✕ TUTUP
              </button>
            </div>

            <div className="space-y-5 text-left">
              {/* Jumlah Pemain */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Jumlah Pemain
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {([2, 3, 4, 5] as const).map((cnt) => (
                    <button
                      key={cnt}
                      onClick={() => setPlayerCount(cnt)}
                      className={`py-2 rounded-lg font-race font-bold text-sm cursor-pointer border ${
                        settings.playerCount === cnt
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {cnt} Player
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Soal */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Materi Soal
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'all', label: 'Campuran' },
                    { key: 'glb', label: 'Hanya GLB' },
                    { key: 'glbb', label: 'Hanya GLBB' },
                  ].map((m) => (
                    <button
                      key={m.key}
                      onClick={() => {
                        sound.playClick();
                        onUpdateSettings({
                          ...settings,
                          materialMode: m.key as 'all' | 'glb' | 'glbb',
                        });
                      }}
                      className={`py-2 px-2 text-xs font-race font-bold rounded-lg cursor-pointer border ${
                        settings.materialMode === m.key
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Panjang Lintasan (Target Soal Benar) */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Panjang Balapan (Target Soal Benar ke Finish)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { count: 5, label: '5 Soal (Cepat)' },
                    { count: 7, label: '7 Soal (Standar)' },
                    { count: 10, label: '10 Soal (Maraton)' },
                  ].map((t) => (
                    <button
                      key={t.count}
                      onClick={() => {
                        sound.playClick();
                        onUpdateSettings({
                          ...settings,
                          targetQuestions: t.count,
                        });
                      }}
                      className={`py-2 px-2 text-xs font-race font-bold rounded-lg cursor-pointer border ${
                        settings.targetQuestions === t.count
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Suara */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Efek Suara
                </label>
                <button
                  onClick={toggleSound}
                  className={`w-full py-2.5 px-4 rounded-xl font-race font-bold text-sm flex items-center justify-center gap-2 border cursor-pointer ${
                    settings.soundEnabled
                      ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span>{settings.soundEnabled ? 'Suara Aktif (ON)' : 'Suara Mati (OFF)'}</span>
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowSettingsModal(false);
                }}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-race font-black text-sm cursor-pointer shadow-lg"
              >
                SIMPAN & KEMBALI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
