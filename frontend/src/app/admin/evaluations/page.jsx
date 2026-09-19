'use client';

import React, { useState } from 'react';
import { useDataStore } from '@/lib/dataStore';
import {
  Award,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Edit3,
  Trash2,
  Calendar,
  X,
  MessageSquare
} from 'lucide-react';

export default function AdminEvaluationsPage() {
  const {
    evaluations,
    judges,
    teams,
    rubrics,
    overrideEvaluationScore,
    deleteEvaluation,
    confirmAction
  } = useDataStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterJudge, setFilterJudge] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Calibration Modal State
  const [isCalibrateOpen, setIsCalibrateOpen] = useState(false);
  const [calibratingEval, setCalibratingEval] = useState(null);
  const [calibratedScore, setCalibratedScore] = useState('');
  const [calibratedFeedback, setCalibratedFeedback] = useState('');

  const activeRubric = rubrics.find(r => r.is_active) || rubrics[0];

  const filteredEvaluations = evaluations.filter(ev => {
    const judge = judges.find(j => j.id === ev.judge_id);
    const team = teams.find(t => t.id === ev.team_id);

    const matchesSearch =
      team?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team?.team_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      judge?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.feedback?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesJudge = filterJudge === 'all' || ev.judge_id === filterJudge;
    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'draft'
        ? ev.is_draft
        : !ev.is_draft;

    return matchesSearch && matchesJudge && matchesStatus;
  });

  const openCalibrateModal = (evaluation) => {
    setCalibratingEval(evaluation);
    setCalibratedScore((Number(evaluation.total_score) || 0).toString());
    setCalibratedFeedback(evaluation.feedback || '');
    setIsCalibrateOpen(true);
  };

  const handleSaveCalibration = (e) => {
    e.preventDefault();
    if (!calibratingEval) return;

    const num = Number(calibratedScore);
    if (isNaN(num)) return;

    overrideEvaluationScore(calibratingEval.id, Math.min(100, Math.max(0, num)), calibratedFeedback);
    setIsCalibrateOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="clean-card p-6 border border-indigo-500/20 bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-indigo">AUDIT TRAIL</span>
            <span className="text-xs font-mono text-slate-400">Scorecard Calibration & Oversight</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Master Evaluation Records ({evaluations.length})
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Inspect all completed scorecards and in-progress drafts, calibrate scores, and review qualitative judge feedback.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-3 py-2 rounded-lg bg-slate-950 border border-white/10">
            <span className="text-slate-400">Completed: </span>
            <strong className="text-emerald-400 font-bold">{evaluations.filter(e => !e.is_draft).length}</strong>
          </div>
          <div className="px-3 py-2 rounded-lg bg-slate-950 border border-white/10">
            <span className="text-slate-400">Drafts: </span>
            <strong className="text-amber-400 font-bold">{evaluations.filter(e => e.is_draft).length}</strong>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by team, judge, or feedback comments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterJudge}
            onChange={(e) => setFilterJudge(e.target.value)}
            className="bg-slate-900 border border-white/10 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Judges</option>
            {judges.map(j => (
              <option key={j.id} value={j.id}>{j.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-900 border border-white/10 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Records</option>
            <option value="final">Final Submitted Only</option>
            <option value="draft">Drafts Only</option>
          </select>
        </div>
      </div>

      {/* Evaluations Table */}
      <div className="clean-card overflow-hidden border border-white/10 bg-slate-900/90">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-white/10 font-mono text-slate-400">
              <tr>
                <th className="p-3.5">TEAM EVALUATED</th>
                <th className="p-3.5">EVALUATING JUDGE</th>
                <th className="p-3.5 text-center">FINAL SCORE</th>
                <th className="p-3.5">JUDGE REMARKS</th>
                <th className="p-3.5 text-center">STATUS</th>
                <th className="p-3.5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-slate-950/40">
              {filteredEvaluations.map(ev => {
                const team = teams.find(t => t.id === ev.team_id);
                const judge = judges.find(j => j.id === ev.judge_id);

                return (
                  <tr key={ev.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-white text-sm">{team?.name || 'Unknown Team'}</div>
                      <div className="font-mono text-[11px] text-indigo-400">{team?.team_code || 'TM-?'}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-white">{judge?.name || 'Unknown Judge'}</div>
                      <div className="text-[11px] font-mono text-slate-400">{judge?.specialization || 'Judge'}</div>
                    </td>

                    <td className="p-3.5 text-center">
                      <span className={`px-2.5 py-1 rounded font-mono font-bold text-sm border inline-block ${
                        ev.is_draft
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {(Number(ev.total_score) || 0).toFixed(1)} / 100
                      </span>
                    </td>

                    <td className="p-3.5 max-w-xs">
                      {ev.feedback ? (
                        <p className="text-slate-300 italic line-clamp-2 text-xs">
                          "{ev.feedback}"
                        </p>
                      ) : (
                        <span className="text-slate-500 text-[11px]">No written feedback</span>
                      )}
                    </td>

                    <td className="p-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${
                        ev.is_draft
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {ev.is_draft ? 'Draft' : 'Submitted'}
                      </span>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openCalibrateModal(ev)}
                          className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-indigo-400 transition-colors"
                          title="Calibrate Score & Feedback"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            confirmAction({
                              title: 'Remove Evaluation Record',
                              message: `Are you sure you want to delete the evaluation scorecard for "${team?.name || 'this team'}" submitted by ${judge?.name || 'Judge'}? This score will be removed from leaderboard averages.`,
                              confirmText: 'Delete Scorecard',
                              isDestructive: true,
                              onConfirm: () => deleteEvaluation(ev.id)
                            });
                          }}
                          className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete Evaluation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredEvaluations.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No evaluations matched your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calibration Modal */}
      {isCalibrateOpen && calibratingEval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="clean-card w-full max-w-md bg-slate-900 border border-white/15 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-400" />
                <span>Calibrate Evaluation Score</span>
              </h2>
              <button
                onClick={() => setIsCalibrateOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCalibration} className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-white/5 space-y-1 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Team:</span>
                  <span className="text-white font-bold">
                    {teams.find(t => t.id === calibratingEval.team_id)?.name}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Judge:</span>
                  <span className="text-white font-bold">
                    {judges.find(j => j.id === calibratingEval.judge_id)?.name}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Normalized Score (0 - 100)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="100"
                  required
                  value={calibratedScore}
                  onChange={(e) => setCalibratedScore(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white font-mono text-base font-bold text-emerald-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Judge Overall Feedback</label>
                <textarea
                  rows={4}
                  value={calibratedFeedback}
                  onChange={(e) => setCalibratedFeedback(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white leading-relaxed"
                  placeholder="Feedback notes..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCalibrateOpen(false)}
                  className="btn-secondary text-xs py-2 px-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-4"
                >
                  Save Calibrated Score
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
