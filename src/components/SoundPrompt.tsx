import React, { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { sound } from '../utils/audio';

export const SoundPrompt: React.FC = () => {
  const [needsUnlock, setNeedsUnlock] = useState(false);

  useEffect(() => {
    // Check if AudioContext is unlocked or running
    if (!sound.isUnlocked() && sound.enabled) {
      setNeedsUnlock(true);
    }

    const handleUserGesture = () => {
      sound.unlock();
      setNeedsUnlock(false);
    };

    window.addEventListener('click', handleUserGesture, { once: true });
    window.addEventListener('touchstart', handleUserGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleUserGesture);
      window.removeEventListener('touchstart', handleUserGesture);
    };
  }, []);

  if (!needsUnlock || !sound.enabled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-bounce">
      <button
        onClick={() => {
          sound.unlock();
          sound.playCorrect();
          setNeedsUnlock(false);
        }}
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-race font-black text-xs sm:text-sm shadow-2xl border-2 border-yellow-200 cursor-pointer transition-all active:scale-95"
      >
        <Volume2 className="w-5 h-5 animate-pulse" />
        <span>🔊 AKTIFKAN SUARA BALAPAN</span>
      </button>
    </div>
  );
};
