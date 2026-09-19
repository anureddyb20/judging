'use client';

import React from 'react';
import Link from 'next/link';
import { useDataStore } from '@/features/shared/services/storage/dataStore';
import {
  Sliders,
  Award,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Scale
} from 'lucide-react';

export default function JudgeRubricsPage() {
  const { rubrics, eventSettings } = useDataStore();

  const activeRubric = rubrics.find(r => r.is_active) || rubrics[0];
  const criteria = activeRubric?.criteria || [];
  const totalMaxMarks = criteria.reduce((sum, c) => sum + (Number(c.max_marks) || 0), 0);

  const benchmarkTiers = [
    {
      name: 'Exceptional',
      pct: '100% Marks',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      description: 'Flawless execution, innovative architecture, polished live demonstration, and deeply validated problem-solution fit.'
    },
    {
      name: 'Good',
      pct: '85% Marks',
      badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      description: 'Solid technical implementation, working prototype, clear utility, and articulate presentation with minor refinement opportunities.'
    },
    {
      name: 'Fair',
      pct: '70% Marks',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      description: 'Functional proof of concept, basic presentation, but lacks technical depth or has significant architecture/market gaps.'
    },
    {
      name: 'Needs Work',
      pct: '50% Marks',
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      description: 'Incomplete codebase, non-functioning demo, poorly structured pitch, or unvalidated conceptual framing.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="clean-card p-6 border border-indigo-500/20 bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-indigo">EVALUATION REFERENCE GUIDE</span>
            <span className="text-xs font-mono text-slate-400">
              Formula: {(activeRubric?.scoring_method || eventSettings?.scoring_method || 'average').toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Scale className="w-7 h-7 text-indigo-400" />
            <span>Rubric Criteria & Benchmark Presets</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Official grading criteria, scoring benchmarks, and evaluation guidelines for {activeRubric?.name || 'Main Ideathon Rubric'}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/judge/dashboard"
            className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
          >
            <span>Start Scoring Teams</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Benchmark Quality Tiers Guide */}
      <div className="clean-card p-6 bg-slate-900/90 border border-white/10 space-y-4">
        <div className="border-b border-white/5 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Standard Scoring Benchmark Tiers</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Use these benchmarks to maintain consistent, fair calibration across all evaluated teams.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {benchmarkTiers.map((tier, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-white/5 space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">{tier.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${tier.badge}`}>
                    {tier.pct}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {tier.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Rubric Criteria Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Active Criteria Breakdown ({criteria.length} Criteria · {totalMaxMarks} Total Points)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {criteria.map((c, idx) => (
            <div key={c.id} className="clean-card p-6 bg-slate-900 border border-white/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono uppercase font-bold text-indigo-400">
                      CRITERION #{idx + 1}
                    </span>
                    <h3 className="text-base font-bold text-white">{c.name}</h3>
                  </div>

                  <span className="px-3 py-1 rounded-lg font-mono font-bold text-sm bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                    Max: {c.max_marks} Pts
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {c.description || 'Evaluate the quality and execution of this dimension during the pitch and demonstration.'}
                </p>
              </div>

              {/* Benchmark point preview for this criterion */}
              <div className="pt-3 border-t border-white/5 grid grid-cols-4 gap-1 text-center font-mono text-[11px]">
                <div className="p-1.5 rounded bg-slate-950 border border-white/5">
                  <span className="text-[9px] text-slate-500 block">Needs Work</span>
                  <span className="text-rose-400 font-bold">{Math.round(c.max_marks * 0.5)}</span>
                </div>
                <div className="p-1.5 rounded bg-slate-950 border border-white/5">
                  <span className="text-[9px] text-slate-500 block">Fair</span>
                  <span className="text-amber-400 font-bold">{Math.round(c.max_marks * 0.7)}</span>
                </div>
                <div className="p-1.5 rounded bg-slate-950 border border-white/5">
                  <span className="text-[9px] text-slate-500 block">Good</span>
                  <span className="text-indigo-300 font-bold">{Math.round(c.max_marks * 0.85)}</span>
                </div>
                <div className="p-1.5 rounded bg-slate-950 border border-white/5">
                  <span className="text-[9px] text-slate-500 block">Exceptional</span>
                  <span className="text-emerald-400 font-bold">{c.max_marks}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
