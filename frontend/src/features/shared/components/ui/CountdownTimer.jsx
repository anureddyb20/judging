'use client';

import React, { useState, useEffect } from 'react';
import { formatTimeRemaining } from '@/lib/utils';
import { Clock, Star, Flame, AlertCircle } from 'lucide-react';

export default function CountdownTimer({ targetDate, label = 'HEIST VAULT LOCKDOWN IN' }) {
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
    <div className="bracket-corners rockstar-card p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5 border border-[#FF007F]/40 bg-gradient-to-r from-[#140628]/95 via-[#1a0836]/90 to-[#0c041d]/95 shadow-[0_10px_35px_rgba(255,0,127,0.25)] rounded-lg">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-[#FF007F] to-[#FF8A00] p-[2px] shadow-[0_0_20px_rgba(255,0,127,0.5)]">
            <div className="w-full h-full bg-[#0d0322] rounded-[6px] flex items-center justify-center text-[#FF007F]">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-mono tracking-widest text-[#FF77BA] font-black uppercase">
              {label}
            </span>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-2.5 h-2.5 wanted-star fill-current" />
              ))}
            </div>
          </div>
          <div className="text-xs font-mono font-bold text-white tracking-wider flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#39FF14] animate-ping" />
            <span className="text-[#00F0FF]">LIVE HEIST TELEMETRY // LEONIDA VAULT</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 font-mono">
        {/* Hours */}
        <div className="flex flex-col items-center bg-[#070210] px-3.5 py-2.5 border border-[#FF007F]/40 rounded min-w-[62px] shadow-[inset_0_0_15px_rgba(255,0,127,0.2)]">
          <span className="text-2xl sm:text-3xl font-black text-[#FF007F] text-glow-pink">
            {timeLeft.hours}
          </span>
          <span className="text-[9px] text-[#c4b5fd] font-bold tracking-widest uppercase mt-0.5">HOURS</span>
        </div>
        <span className="text-2xl font-black text-[#FF007F] animate-pulse">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center bg-[#070210] px-3.5 py-2.5 border border-[#FF8A00]/40 rounded min-w-[62px] shadow-[inset_0_0_15px_rgba(255,138,0,0.2)]">
          <span className="text-2xl sm:text-3xl font-black text-[#FF8A00] text-glow-gold">
            {timeLeft.minutes}
          </span>
          <span className="text-[9px] text-[#c4b5fd] font-bold tracking-widest uppercase mt-0.5">MINS</span>
        </div>
        <span className="text-2xl font-black text-[#00F0FF] animate-pulse">:</span>

        {/* Seconds */}
        <div className="flex flex-col items-center bg-[#070210] px-3.5 py-2.5 border border-[#00F0FF]/40 rounded min-w-[62px] shadow-[inset_0_0_15px_rgba(0,240,255,0.2)]">
          <span className="text-2xl sm:text-3xl font-black text-[#00F0FF] text-glow-cyan">
            {timeLeft.seconds}
          </span>
          <span className="text-[9px] text-[#c4b5fd] font-bold tracking-widest uppercase mt-0.5">SECS</span>
        </div>
      </div>
    </div>
  );
}
