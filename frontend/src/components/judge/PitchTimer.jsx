'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Volume2, 
  VolumeX, 
  AlertTriangle,
  Zap
} from 'lucide-react';

export function PitchTimer({ compact = false, onTimeWarning, onTimeExpire }) {
  const [mode, setMode] = useState('pitch'); // 'pitch' | 'qa'
  const [pitchDuration, setPitchDuration] = useState(300); // 5 min
  const [qaDuration, setQaDuration] = useState(180); // 3 min
  const [secondsRemaining, setSecondsRemaining] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [overtime, setOvertime] = useState(0);

  const totalDuration = mode === 'pitch' ? pitchDuration : qaDuration;
  const isOvertime = secondsRemaining <= 0;
  const isWarning = secondsRemaining > 0 && secondsRemaining <= 60;

  // Web Audio API gentle synthesizer beep
  const playBeep = (frequency = 600, duration = 0.2) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio chime warning:', e);
    }
  };

  // Timer Tick Interval
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            setOvertime(ot => ot + 1);
            if (prev === 1) {
              playBeep(880, 0.4);
              if (onTimeExpire) onTimeExpire();
            }
            return 0;
          }
          if (prev === 61) {
            playBeep(520, 0.25);
            if (onTimeWarning) onTimeWarning();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, onTimeWarning, onTimeExpire, soundEnabled]);

  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setOvertime(0);
    const dur = newMode === 'pitch' ? pitchDuration : qaDuration;
    setSecondsRemaining(dur);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setOvertime(0);
    setSecondsRemaining(totalDuration);
  };

  const setPreset = (mins) => {
    setIsRunning(false);
    setOvertime(0);
    const secs = mins * 60;
    if (mode === 'pitch') {
      setPitchDuration(secs);
    } else {
      setQaDuration(secs);
    }
    setSecondsRemaining(secs);
  };

  // Format MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progressPercent = totalDuration > 0
    ? Math.max(0, Math.min(100, ((totalDuration - secondsRemaining) / totalDuration) * 100))
    : 0;

  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-slate-900 border border-white/10 px-3 py-1.5 rounded-lg">
        <div className="flex items-center gap-1.5">
          <Clock className={`w-3.5 h-3.5 ${isOvertime ? 'text-rose-400 animate-pulse' : isWarning ? 'text-amber-400' : 'text-indigo-400'}`} />
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
            {mode === 'pitch' ? 'Pitch' : 'Q&A'}:
          </span>
          <span className={`font-mono font-bold text-xs ${
            isOvertime ? 'text-rose-400 animate-pulse' : isWarning ? 'text-amber-300' : 'text-white'
          }`}>
            {isOvertime ? `+${formatTime(overtime)}` : formatTime(secondsRemaining)}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className={`p-1 rounded text-xs transition-colors ${
              isRunning ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
            }`}
            title={isRunning ? 'Pause Timer' : 'Start Timer'}
          >
            {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>
          <button
            type="button"
            onClick={resetTimer}
            className="p-1 rounded text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`clean-card p-4 transition-all border ${
      isOvertime 
        ? 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-950/30' 
        : isWarning 
        ? 'bg-amber-950/20 border-amber-500/30' 
        : 'bg-slate-900 border-white/10'
    }`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Mode Selector & Status */}
        <div className="flex items-center gap-2">
          <div className="inline-flex p-0.5 rounded-lg bg-slate-950 border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => switchMode('pitch')}
              className={`px-3 py-1 rounded-md font-semibold text-xs transition-all ${
                mode === 'pitch' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎤 Pitch (5m)
            </button>
            <button
              type="button"
              onClick={() => switchMode('qa')}
              className={`px-3 py-1 rounded-md font-semibold text-xs transition-all ${
                mode === 'qa' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ❓ Q&A (3m)
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-400">
            <span>Presets:</span>
            {[3, 5, 8].map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setPreset(m)}
                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px]"
              >
                {m}m
              </button>
            ))}
          </div>
        </div>

        {/* Right Controls: Mute & Overtime badge */}
        <div className="flex items-center gap-2">
          {isOvertime && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
              <AlertTriangle className="w-3 h-3" />
              <span>OVERTIME</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1.5 rounded text-xs border transition-colors ${
              soundEnabled ? 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10' : 'text-slate-500 border-white/5 bg-slate-950'
            }`}
            title={soundEnabled ? 'Sound Enabled' : 'Sound Muted'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Countdown Display & Action Bar */}
      <div className="flex items-center justify-between gap-4 mt-3 pt-3 border-t border-white/5">
        <div className="flex items-baseline gap-2">
          <div className={`font-mono text-3xl sm:text-4xl font-black tracking-tight ${
            isOvertime 
              ? 'text-rose-400' 
              : isWarning 
              ? 'text-amber-300 animate-pulse' 
              : 'text-white'
          }`}>
            {isOvertime ? `+${formatTime(overtime)}` : formatTime(secondsRemaining)}
          </div>
          <span className="text-[11px] font-mono text-slate-400 uppercase">
            {isOvertime ? 'Overtime' : mode === 'pitch' ? 'Pitch Time' : 'Q&A Time'}
          </span>
        </div>

        {/* Play/Pause & Reset Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-md ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Start Clock</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={resetTimer}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition-colors"
            title="Reset Clock"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Elapsed Progress Bar */}
      <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden mt-3">
        <div 
          className={`h-full transition-all duration-300 ${
            isOvertime ? 'bg-rose-500' : isWarning ? 'bg-amber-400' : 'bg-indigo-500'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
