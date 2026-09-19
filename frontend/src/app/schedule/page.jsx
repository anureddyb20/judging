'use client';

import React from 'react';
import { useDataStore } from '@/lib/dataStore';
import { Clock, Calendar, CheckCircle2, Award } from 'lucide-react';

export default function SchedulePage() {
  const { schedule = [], eventSettings } = useDataStore();

  const sortedSchedule = [...schedule].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="badge-indigo">EVENT PHASES</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Ideathon Schedule & Timeline
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Order of presentations, judge deliberation rounds, and final winner ceremony.
        </p>
      </div>

      <div className="space-y-4">
        {sortedSchedule.map((phase, idx) => {
          const isCurrent = phase.status === 'active';
          const isDone = phase.status === 'completed';

          return (
            <div
              key={phase.id}
              className={`clean-card p-5 sm:p-6 transition-all ${
                isCurrent
                  ? 'border-indigo-500/50 bg-slate-900 shadow-md'
                  : isDone
                  ? 'bg-slate-950/80 border-white/5 opacity-80'
                  : 'bg-slate-950/40 border-white/5'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {phase.phase_number}
                  </span>
                  {isCurrent && (
                    <span className="badge-emerald text-[10px]">
                      ● IN PROGRESS
                    </span>
                  )}
                  {isDone && (
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Completed</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-indigo-400 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    {phase.time_slot}
                  </span>
                </div>
              </div>

              <h2 className="text-base font-bold text-white mb-1">
                {phase.phase_name}
              </h2>

              <p className="text-xs text-slate-400 leading-relaxed">
                {phase.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
