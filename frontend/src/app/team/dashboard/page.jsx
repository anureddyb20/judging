'use client';

import React from 'react';
import Link from 'next/link';
import { useDataStore } from '@/lib/dataStore';
import { aggregateTeamScores, computeLeaderboard } from '@/lib/scoring';
import { 
  Trophy, 
  UploadCloud, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  FileText,
  Github,
  Award,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function TeamDashboard() {
  const { 
    currentUser, 
    teams, 
    missions, 
    evaluations, 
    rubrics, 
    eventSettings 
  } = useDataStore();

  // Find active team for the logged in user
  const currentTeam = teams.find(t => 
    t.team_code === currentUser?.team_code || 
    t.id === currentUser?.team_id
  ) || teams[0];

  const mission = missions.find(m => m.id === currentTeam?.mission_id);
  const activeRubric = rubrics.find(r => r.is_active) || rubrics[0];
  const aggregate = aggregateTeamScores(currentTeam?.id, evaluations, activeRubric?.criteria, eventSettings.scoring_method);
  
  const allRanked = computeLeaderboard(teams, evaluations, activeRubric?.criteria, eventSettings.scoring_method);
  const myRankEntry = allRanked.find(t => t.id === currentTeam?.id);
  const currentRank = myRankEntry?.rank || '-';

  const teamEvaluations = evaluations.filter(e => e.team_id === currentTeam?.id && !e.is_draft);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Team Header */}
      <div className="clean-card p-6 sm:p-8 border border-indigo-500/20 bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="badge-indigo">{currentTeam?.team_code}</span>
            <span className="text-xs text-slate-400 font-mono">
              {currentTeam?.room} · Pitch Slot: {currentTeam?.pitch_slot}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {currentTeam?.name}
          </h1>
          <p className="text-xs text-slate-400">
            {mission?.title} · Status: <span className="font-semibold text-white uppercase">{currentTeam?.pitch_status}</span>
          </p>
        </div>

        {/* Live Score & Rank Cards */}
        <div className="flex items-center gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-white/5 text-center min-w-[120px]">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">CURRENT RANK</div>
            <div className="text-3xl font-extrabold text-white mt-0.5">#{currentRank}</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 text-center min-w-[140px]">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">AGGREGATE SCORE</div>
            <div className="text-3xl font-extrabold font-mono text-indigo-400 mt-0.5">
              {eventSettings.show_live_score ? aggregate.finalScore.toFixed(1) : '***'}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Project Blueprint & Evaluation Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Project Submission Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="clean-card p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Project Dossier & Links
                </h2>
                <p className="text-xs text-slate-400">Your submitted blueprint for the judging panel.</p>
              </div>
              <Link href="/team/submission" className="btn-secondary text-xs py-1.5 px-3">
                Edit Links
              </Link>
            </div>

            <div>
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase mb-1">PROJECT TITLE</div>
              <div className="text-base font-bold text-white">
                {currentTeam?.submission?.project_title || 'Untitled Project'}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">PROBLEM STATEMENT</div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-lg border border-white/5">
                {currentTeam?.submission?.problem_statement || 'No problem statement provided.'}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">PROPOSED SOLUTION</div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-lg border border-white/5">
                {currentTeam?.submission?.solution || 'No solution provided.'}
              </p>
            </div>

            {/* Links */}
            <div className="pt-3 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {currentTeam?.submission?.deck_url && (
                <a
                  href={currentTeam.submission.deck_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded bg-slate-950 hover:bg-slate-900 border border-white/10 text-indigo-300 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Pitch Deck</span>
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {currentTeam?.submission?.github_url && (
                <a
                  href={currentTeam.submission.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded bg-slate-950 hover:bg-slate-900 border border-white/10 text-indigo-300 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub Code</span>
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Judge Scorecard & Feedback */}
        <div className="lg:col-span-5 space-y-6">
          <div className="clean-card p-6 space-y-5">
            <div className="border-b border-white/5 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Judge Evaluations & Remarks
              </h2>
              <p className="text-xs text-slate-400">
                {teamEvaluations.length} Evaluation{teamEvaluations.length !== 1 ? 's' : ''} Received
              </p>
            </div>

            {teamEvaluations.length === 0 ? (
              <div className="p-8 text-center text-slate-500 bg-slate-950/50 rounded-lg border border-white/5">
                <Clock className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <div className="text-xs font-semibold text-slate-300">Awaiting Judging Panel</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Scores and feedback will appear here once the judging panel completes evaluation.
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {teamEvaluations.map((ev, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">
                        Evaluator #{idx + 1}
                      </span>
                      {eventSettings.show_live_score && (
                        <span className="text-xs font-mono font-bold text-indigo-400">
                          {ev.total_score.toFixed(1)} / 100
                        </span>
                      )}
                    </div>

                    {ev.feedback && (
                      <p className="text-xs text-slate-300 italic bg-slate-900/60 p-3 rounded border border-white/5 leading-relaxed">
                        "{ev.feedback}"
                      </p>
                    )}

                    {/* Criteria Breakdown */}
                    {eventSettings.show_rubric_breakdown && ev.criteria_scores?.length > 0 && (
                      <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2 text-[11px]">
                        {ev.criteria_scores.map(cs => {
                          const crit = activeRubric?.criteria?.find(c => c.id === cs.criterion_id);
                          return (
                            <div key={cs.criterion_id} className="p-1.5 rounded bg-slate-900 border border-white/5 flex items-center justify-between font-mono">
                              <span className="text-slate-400 truncate mr-2">{crit?.name || 'Criterion'}</span>
                              <span className="font-bold text-white">{cs.score}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
