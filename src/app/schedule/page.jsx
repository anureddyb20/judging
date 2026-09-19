'use client';

import React from 'react';
import { useDataStore } from '@/lib/dataStore';
import TerminalHeader from '@/components/layout/TerminalHeader';
import { Clock, Calendar, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function SchedulePage() {
  const { schedule, eventSettings } = useDataStore();

  const sortedSchedule = [...schedule].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 cyber-grid-bg">
      <TerminalHeader
        title="MISSION TIMELINE & PHASES"
        subtitle="Chronological sequence of tactical phases for VICEVERSE 2026. Keep your squad synchronized."
        badgeText="TIMELINE TELEMETRY"
        badgeColor="yellow"
      />

      <div className="space-y-6 relative before:absolute before:inset-0 before:left-6 sm:before:left-8 before:w-0.5 before:bg-gradient-to-b before:from-yellow-500 before:via-cyan-500 before:to-zinc-800">
        {sortedSchedule.map((phase, idx) => {
          const isCurrent = phase.status === 'active';
          const isDone = phase.status === 'completed';

          return (
            <div key={phase.id} className="relative flex items-start gap-4 sm:gap-6 pl-1 sm:pl-3 group">
              {/* Node Indicator */}
              <div 
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-mono font-black text-xs shrink-0 z-10 transition-all ${
                  isCurrent
                    ? 'bg-[var(--primary)] text-black ring-4 ring-[var(--primary-glow)] animate-pulse'
                    : isDone
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500'
                    : 'bg-zinc-900 text-zinc-500 border border-zinc-700'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
              </div>

              {/* Card */}
              <div 
                className={`bracket-corners rockstar-card flex-1 p-5 sm:p-6 border transition-all ${
                  isCurrent 
                    ? 'border-[var(--border-gold)] bg-yellow-950/15 shadow-[0_0_25px_rgba(253,191,21,0.15)]' 
                    : isDone
                    ? 'border-zinc-800 bg-black/70 opacity-90'
                    : 'border-zinc-800/80 bg-zinc-950/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 bg-zinc-900 border border-zinc-700 text-zinc-300 uppercase">
                      {phase.phase_number}
                    </span>
                    {isCurrent && (
                      <span className="tag-yellow text-[9px] animate-pulse">
                        ● CURRENT PHASE ACTIVE
                      </span>
                    )}
                    {isDone && (
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        ✓ COMPLETED
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
                    <span className="flex items-center gap-1 text-[var(--cyan)]">
                      <Calendar className="w-3.5 h-3.5" />
                      {phase.date_slot}
                    </span>
                    <span className="flex items-center gap-1 text-yellow-400">
                      <Clock className="w-3.5 h-3.5" />
                      {phase.time_slot}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-heading font-black text-white mb-2 tracking-wide">
                  {phase.phase_name}
                </h3>

                <p className="font-mono text-xs text-zinc-300 leading-relaxed">
                  {phase.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
