'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDataStore } from '@/features/shared/services/storage/dataStore';
import { PitchTimer } from '@/components/judge/PitchTimer';
import {
  Timer,
  Clock,
  Award,
  Users,
  MapPin,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function JudgeTimerPage() {
  const { currentUser, judges, teams, assignments, evaluations } = useDataStore();

  const currentJudge = judges.find(j =>
    j.id === currentUser?.id ||
    j.profile_id === currentUser?.id ||
    j.id === currentUser?.judge_id ||
    j.judge_code === currentUser?.team_code
  ) || judges[0];

  const myAssignedTeams = assignments
    .filter(a => a.judge_id === currentJudge?.id)
    .map(a => teams.find(t => t.id === a.team_id))
    .filter(Boolean);

  const [selectedTeamId, setSelectedTeamId] = useState(myAssignedTeams[0]?.id || '');

  const selectedTeam = myAssignedTeams.find(t => t.id === selectedTeamId) || myAssignedTeams[0];
  const selectedEval = selectedTeam ? evaluations.find(e => e.judge_id === currentJudge?.id && e.team_id === selectedTeam.id) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="clean-card p-6 border border-indigo-500/20 bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-indigo">EVALUATOR TIMEKEEPER</span>
            <span className="text-xs font-mono text-slate-400">
              {currentJudge?.assigned_room || 'Main Presentation Room'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Timer className="w-7 h-7 text-indigo-400" />
            <span>Live Pitch & Q&A Cockpit Clock</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Official countdown timer for student pitches and jury questions. Features audio alerts and overtime tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedTeam && (
            <Link
              href={`/judge/evaluate/${selectedTeam.id}`}
              className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              <Award className="w-4 h-4" />
              <span>Score {selectedTeam.team_code} ➔</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Pitch Timer Component */}
      <div className="clean-card p-8 bg-slate-900 border border-white/10 space-y-6 shadow-2xl">
        <PitchTimer />
      </div>

      {/* Stage Team Sync & Scorecard Connector */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7 clean-card p-6 bg-slate-900/90 border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Team on the Stage</span>
            </h2>
            <span className="text-[11px] font-mono text-slate-400">
              Select who is presenting
            </span>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-mono uppercase text-slate-400">
              Active Presenter in Your Room:
            </label>
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 text-white rounded-lg p-2.5 text-xs font-mono focus:outline-none focus:border-indigo-500"
            >
              {myAssignedTeams.map(t => (
                <option key={t.id} value={t.id}>
                  {t.team_code} · {t.name} ({t.pitch_slot || t.room})
                </option>
              ))}
            </select>

            {selectedTeam && (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 space-y-3 mt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {selectedTeam.team_code}
                    </span>
                    <h3 className="text-base font-bold text-white">{selectedTeam.name}</h3>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${
                    selectedEval && !selectedEval.is_draft
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    {selectedEval && !selectedEval.is_draft ? `Score: ${selectedEval.total_score.toFixed(1)}` : 'Pending Score'}
                  </span>
                </div>

                <div className="text-xs text-slate-300 line-clamp-2">
                  {selectedTeam.submission?.project_title || selectedTeam.submission?.problem_statement || 'Project presentation pitch.'}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{selectedTeam.room} · {selectedTeam.pitch_slot}</span>
                  </span>

                  <Link
                    href={`/judge/evaluate/${selectedTeam.id}`}
                    className="btn-primary text-xs py-1.5 px-3 inline-flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Open Scorecard</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pitch Protocol Guidelines Card */}
        <div className="md:col-span-5 clean-card p-6 bg-slate-900/90 border border-white/10 space-y-4">
          <div className="border-b border-white/5 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Presentation Protocol</span>
            </h2>
            <span className="text-[11px] font-mono text-slate-400">Standard round timing</span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="p-3 rounded-lg bg-slate-950 border border-white/5 flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-400 font-mono font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <div>
                <strong className="text-white block font-mono">5 Minutes: Team Pitch</strong>
                <span>Uninterrupted slide presentation and live demonstration by the team.</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-white/5 flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-400 font-mono font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <div>
                <strong className="text-white block font-mono">3 Minutes: Jury Q&A</strong>
                <span>Evaluators question the team regarding technical feasibility, market validation, and architecture.</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-white/5 flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-400 font-mono font-bold flex items-center justify-center shrink-0">
                3
              </span>
              <div>
                <strong className="text-white block font-mono">2 Minutes: Marks Calibration</strong>
                <span>Judges finalize rubric criteria scores and input qualitative feedback before the next team.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
