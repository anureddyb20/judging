'use client';

import React from 'react';
import Link from 'next/link';
import { useDataStore } from '@/lib/dataStore';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function ProblemTracksPage() {
  const { missions, teams } = useDataStore();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">
              INNOVATION CHALLENGES
            </span>
            <span className="text-xs text-slate-400">Ideathon Track Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Problem Tracks & Focus Areas
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Explore the official technical problem statements for this edition. All project blueprints must align with one of these approved tracks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission) => {
            const trackTeams = teams.filter(t => t.mission_id === mission.id);

            return (
              <div
                key={mission.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-6 flex flex-col justify-between transition-all shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 text-xs font-mono font-bold bg-indigo-950/60 text-indigo-300 border border-indigo-800/40 rounded-md">
                      {mission.id}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {trackTeams.length} {trackTeams.length === 1 ? 'Team' : 'Teams'} Registered
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{mission.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-6 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                    {mission.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-400">
                    Difficulty: Standard
                  </span>

                  <Link
                    href={`/leaderboard?track=${mission.id}`}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors border border-slate-700"
                  >
                    View Track Teams →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
