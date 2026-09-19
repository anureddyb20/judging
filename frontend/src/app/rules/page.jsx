'use client';

import React from 'react';
import Link from 'next/link';
import { useDataStore } from '@/lib/dataStore';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function GuidelinesPage() {
  const { rubrics } = useDataStore();
  const activeRubric = rubrics.find(r => r.is_active) || rubrics[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">
              OFFICIAL HANDBOOK
            </span>
            <span className="text-xs text-slate-400">Ideathon Judging Standards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Rules, Guidelines & Rubrics
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            All teams and judges must adhere to these scoring standards and code of conduct throughout the event.
          </p>
        </div>

        {/* 100-pt Rubric Standards */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-10 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">Evaluation Rubric Matrix</span>
              <h2 className="text-2xl font-bold text-white mt-1">{activeRubric?.title} (100 Marks Total)</h2>
            </div>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-lg self-start sm:self-auto">
              ✓ Active Official Rubric
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeRubric?.criteria.map((criterion, idx) => (
              <div key={criterion.id} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-indigo-400 flex items-center justify-center text-xs font-mono">
                      {idx + 1}
                    </span>
                    {criterion.name}
                  </h3>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 bg-indigo-950/60 text-indigo-300 border border-indigo-800/40 rounded">
                    {criterion.max_points} Points Max
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{criterion.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pitch Rules & Timeline Format */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
              <span className="font-mono font-bold">5m</span>
            </div>
            <h3 className="text-base font-bold text-white mb-2">Strict Pitch Time Limit</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Teams have exactly 5 minutes for their uninterrupted presentation and live prototype walkthrough. Room coordinators will enforce time limits.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
              <span className="font-mono font-bold">3m</span>
            </div>
            <h3 className="text-base font-bold text-white mb-2">Jury Q&A Chamber</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Judges have 3 minutes for technical scrutiny, architecture verification, and questions before submitting marks on the digital judging portal.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <span className="font-mono font-bold">100%</span>
            </div>
            <h3 className="text-base font-bold text-white mb-2">Originality & Fair Play</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              All code and design assets must be developed during the hackathon or declared beforehand in the team repository. Plagiarism results in instant disqualification.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
