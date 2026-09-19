'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDataStore } from '@/features/shared/services/storage/dataStore';
import {
  Award,
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  Edit3,
  FileText,
  TrendingUp,
  MapPin,
  ShieldCheck,
  Eye,
  Sliders,
  Sparkles
} from 'lucide-react';
import TeamDossierModal from '@/components/ui/TeamDossierModal';

export default function JudgeHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'submitted' | 'draft'
  const [activeModalTeam, setActiveModalTeam] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    currentUser,
    judges,
    teams,
    missions,
    evaluations,
    rubrics
  } = useDataStore();

  const currentJudge = judges.find(j =>
    j.id === currentUser?.id ||
    j.profile_id === currentUser?.id ||
    j.id === currentUser?.judge_id ||
    j.judge_code === currentUser?.team_code
  ) || judges[0];

  const activeRubric = rubrics.find(r => r.is_active) || rubrics[0];

  // Get all evaluations belonging to this judge
  const myEvaluations = evaluations.filter(e => e.judge_id === currentJudge?.id);

  // Enrich evaluations with team data
  const enrichedHistory = myEvaluations.map(ev => {
    const team = teams.find(t => t.id === ev.team_id);
    const mission = missions.find(m => m.id === team?.mission_id);
    return {
      evaluation: ev,
      team,
      mission,
      score: Number(ev.total_score) || 0,
      isDraft: !!ev.is_draft,
      updatedAt: ev.updated_at || ev.created_at || new Date().toISOString()
    };
  }).filter(item => item.team);

  // Personal Scoring Statistics
  const completedEvals = enrichedHistory.filter(h => !h.isDraft);
  const totalCompleted = completedEvals.length;
  const scoresArray = completedEvals.map(h => h.score);

  const avgScore = totalCompleted > 0
    ? (scoresArray.reduce((sum, s) => sum + s, 0) / totalCompleted).toFixed(1)
    : '0.0';
  const highestScore = totalCompleted > 0
    ? Math.max(...scoresArray).toFixed(1)
    : '0.0';
  const lowestScore = totalCompleted > 0
    ? Math.min(...scoresArray).toFixed(1)
    : '0.0';
  const withFeedbackCount = completedEvals.filter(h => h.evaluation.feedback && h.evaluation.feedback.trim().length > 0).length;

  const filteredHistory = enrichedHistory.filter(h => {
    const matchesSearch =
      h.team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.team.team_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.mission?.title && h.mission.title.toLowerCase().includes(searchQuery.toLowerCase()));

    if (filterStatus === 'submitted') return matchesSearch && !h.isDraft;
    if (filterStatus === 'draft') return matchesSearch && h.isDraft;
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="clean-card p-6 border border-indigo-500/20 bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-indigo">CONFIDENTIAL SCORECARD LEDGER</span>
            <span className="text-xs font-mono text-slate-400">
              {currentJudge?.judge_code} · {currentJudge?.name}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            My Evaluation History
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit your submitted scores and qualitative feedback notes. Note: External leaderboards are strictly hidden to ensure impartial judging.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link
            href="/judge/dashboard"
            className="btn-primary text-xs py-2 px-3.5 inline-flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Open Evaluator Cockpit</span>
          </Link>
        </div>
      </div>

      {/* Evaluator Personal Scoring Calibration Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="clean-card p-4 bg-slate-900/90 border border-white/10 space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">Evaluated Teams</div>
          <div className="text-2xl font-black text-white">{totalCompleted}</div>
          <div className="text-[10px] text-slate-500 font-mono">
            {enrichedHistory.filter(h => h.isDraft).length} Drafts Pending
          </div>
        </div>

        <div className="clean-card p-4 bg-slate-900/90 border border-white/10 space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">Personal Avg Score</div>
          <div className="text-2xl font-black text-indigo-400">{avgScore}</div>
          <div className="text-[10px] text-slate-500 font-mono">
            Out of 100.0 pts
          </div>
        </div>

        <div className="clean-card p-4 bg-slate-900/90 border border-white/10 space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">Highest Awarded</div>
          <div className="text-2xl font-black text-emerald-400">{highestScore}</div>
          <div className="text-[10px] text-slate-500 font-mono">
            Lowest: {lowestScore} pts
          </div>
        </div>

        <div className="clean-card p-4 bg-slate-900/90 border border-white/10 space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">Feedback Rate</div>
          <div className="text-2xl font-black text-teal-400">
            {totalCompleted > 0 ? `${Math.round((withFeedbackCount / totalCompleted) * 100)}%` : '0%'}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {withFeedbackCount} / {totalCompleted} with detailed comments
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {[
            { id: 'all', label: `All Records (${enrichedHistory.length})` },
            { id: 'submitted', label: `Final Submitted (${totalCompleted})` },
            { id: 'draft', label: `Drafts (${enrichedHistory.filter(h => h.isDraft).length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                filterStatus === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search team name, code, track..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-9 text-xs"
          />
        </div>
      </div>

      {/* Master History Table */}
      <div className="clean-card bg-slate-900/90 border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-[11px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/10">
              <tr>
                <th className="p-3.5">Team & Project</th>
                <th className="p-3.5">Track / Pitch Slot</th>
                <th className="p-3.5">Criteria Breakdown</th>
                <th className="p-3.5 text-center">Score Awarded</th>
                <th className="p-3.5">Qualitative Feedback</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {filteredHistory.map(({ evaluation, team, mission, score, isDraft, updatedAt }) => {
                const criteriaScores = evaluation.criteria_scores || evaluation.scores || [];

                return (
                  <tr key={evaluation.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-white text-sm">{team.name}</div>
                      <div className="font-mono text-[11px] text-indigo-400 mt-0.5">{team.team_code}</div>
                    </td>

                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-indigo-950/50 text-indigo-300 border border-indigo-500/20 text-[11px]">
                        {mission?.title || 'General Track'}
                      </span>
                      <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{team.room} · {team.pitch_slot}</span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {criteriaScores.map((cs, idx) => {
                          const crit = activeRubric?.criteria?.find(c => c.id === cs.criterion_id) || activeRubric?.criteria?.[idx];
                          return (
                            <span
                              key={cs.criterion_id || idx}
                              className="px-1.5 py-0.5 rounded bg-slate-950 border border-white/10 text-[10px] font-mono text-slate-300"
                              title={`${crit?.name || 'Criterion'}: ${cs.score} / ${crit?.max_marks || 25}`}
                            >
                              {crit?.name ? crit.name.split(' ')[0] : `C${idx + 1}`}: <strong className="text-white">{cs.score}</strong>
                            </span>
                          );
                        })}
                        {criteriaScores.length === 0 && (
                          <span className="text-[11px] text-slate-500 font-mono">No criteria marks recorded</span>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className={`px-3 py-1 rounded-lg font-mono font-bold text-sm border ${
                          isDraft
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {score.toFixed(1)} / 100
                        </span>
                        <span className="text-[9px] font-mono uppercase text-slate-500 mt-1">
                          {isDraft ? 'Draft' : 'Submitted'}
                        </span>
                      </div>
                    </td>

                    <td className="p-3.5 max-w-sm">
                      {evaluation.feedback ? (
                        <p className="text-xs text-slate-300 line-clamp-2 italic">
                          "{evaluation.feedback}"
                        </p>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">No feedback notes entered</span>
                      )}
                      <div className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span suppressHydrationWarning>
                          {mounted ? new Date(updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                        </span>
                      </div>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setActiveModalTeam(team)}
                          className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-indigo-400 transition-colors"
                          title="View Team Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <Link
                          href={`/judge/evaluate/${team.id}`}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 text-[11px] font-semibold inline-flex items-center gap-1 transition-all"
                        >
                          <Edit3 className="w-3 h-3 text-indigo-400" />
                          <span>Revise</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredHistory.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">
                    No evaluations match your query. Complete evaluations in your dashboard to view your ledger history.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Dossier Modal */}
      <TeamDossierModal
        team={activeModalTeam}
        isOpen={!!activeModalTeam}
        onClose={() => setActiveModalTeam(null)}
      />
    </div>
  );
}
