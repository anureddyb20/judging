'use client';

import React, { useState, useEffect } from 'react';
import { formatTimeRemaining } from '@/lib/utils';
import { Clock } from 'lucide-react';

export default function CountdownTimer({ targetDate, label = 'SUBMISSION VAULT CLOSES IN' }) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: '00', minutes: '00', seconds: '00', isExpired: false });

  useEffect(() => {
    setMounted(true);
    setTimeLeft(formatTimeRemaining(targetDate));
    const interval = setInterval(() => {
      setTimeLeft(formatTimeRemaining(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="bracket-corners rockstar-card p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[var(--border-gold)] bg-black/70">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded bg-[var(--primary-subtle)] border border-[var(--primary)] flex items-center justify-center text-[var(--primary)] animate-pulse">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[10px] font-mono tracking-widest text-[var(--text-dim)] uppercase">
            {label}
          </div>
          <div className="text-xs font-mono font-bold text-white tracking-wider flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[var(--lime)] animate-ping" />
            COUNTDOWN TELEMETRY LIVE
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 font-mono">
        <div className="flex flex-col items-center bg-[var(--bg-surface)] px-3 py-2 border border-[var(--border-dim)] min-w-[55px]">
          <span className="text-2xl sm:text-3xl font-black text-[var(--primary)] text-glow-yellow">
            {timeLeft.hours}
          </span>
          <span className="text-[9px] text-[var(--text-dim)] tracking-widest uppercase">HRS</span>
        </div>
        <span className="text-2xl font-bold text-[var(--primary)] animate-pulse">:</span>
        <div className="flex flex-col items-center bg-[var(--bg-surface)] px-3 py-2 border border-[var(--border-dim)] min-w-[55px]">
          <span className="text-2xl sm:text-3xl font-black text-[var(--cyan)] text-glow-cyan">
            {timeLeft.minutes}
          </span>
          <span className="text-[9px] text-[var(--text-dim)] tracking-widest uppercase">MIN</span>
        </div>
        <span className="text-2xl font-bold text-[var(--cyan)] animate-pulse">:</span>
        <div className="flex flex-col items-center bg-[var(--bg-surface)] px-3 py-2 border border-[var(--border-dim)] min-w-[55px]">
          <span className="text-2xl sm:text-3xl font-black text-[var(--accent)]">
            {timeLeft.seconds}
          </span>
          <span className="text-[9px] text-[var(--text-dim)] tracking-widest uppercase">SEC</span>
        </div>
      </div>
    </div>
  );
}
