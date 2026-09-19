'use client';

import React from 'react';
import { useDataStore } from '@/lib/dataStore';
import { 
  X, 
  Users, 
  Clock, 
  MapPin, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Github, 
  FileText, 
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function TeamDossierModal({ team, isOpen, onClose }) {
  const { missions, rubrics, evaluations, judges, coordinators } = useDataStore();

  if (!isOpen || !team) return null;

  const mission = missions.find(m => m.id === team.mission_id) || { title: team.mission_id || 'General Track' };
  const activeRubric = rubrics.find(r => r.is_active) || rubrics[0];
  
  // All completed evaluations for this team
  const teamEvals = evaluations.filter(e => e.team_id === team.id && !e.is_draft);
  const isEvaluated = teamEvals.length > 0;

  // Composite / Average Total Score
  const totalScore = isEvaluated
    ? teamEvals.reduce((acc, curr) => acc + curr.total_score, 0) / teamEvals.length
    : 0;

  // Find assigned room coordinator
  const roomCoordinator = coordinators.find(c => c.assigned_room?.includes(team.room || team.assigned_room)) || coordinators[0];

  const submission = team.submission || team.submission_details || {};
  const membersList = team.members || [
    { name: team.leader_name || 'Team Leader', role: 'Team Lead', email: team.leader_email || 'lead@club.edu' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 bg-slate-950/90 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded">
                {team.team_code}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">
                Track: {mission.title}
              </span>
              {team.checked_in ? (
                <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Checked In
                </span>
              ) : (
                <span className="text-xs font-semibold px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Check-in Pending
                </span>
              )}
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight pt-1">
              {team.name}
            </h2>
            <p className="text-xs text-slate-400">
              {submission.project_title || team.description || 'Project Blueprint Proposal'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200 text-xs">
          {/* Top Quick Status Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Pitch Room</div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>{team.room || team.assigned_room || 'Seminar Hall A'}</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Scheduled Slot</div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>{team.pitch_slot || '10:00 AM'}</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Round 1 Status</div>
              <div className="text-sm font-bold capitalize text-indigo-300 mt-0.5">
                {team.pitch_status || 'Scheduled'}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Verified Score</div>
              <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5 flex items-baseline gap-1">
                {isEvaluated ? `${(Number(totalScore) || 0).toFixed(1)} / 100` : 'Pending'}
              </div>
            </div>
          </div>

          {/* Problem Statement & Solution */}
          <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Problem Statement & Proposed Solution
            </h3>
            
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">Target Problem (PS)</span>
                <p className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-slate-300 leading-relaxed">
                  {submission.problem_statement || team.description || 'Target problem defined by the team for this track.'}
                </p>
              </div>

              <div>
                <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">Proposed Technical Solution</span>
                <p className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-slate-300 leading-relaxed">
                  {submission.solution || team.description || 'Architecture and implementation blueprint.'}
                </p>
              </div>

              {submission.tech_stack && submission.tech_stack.length > 0 && (
                <div>
                  <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] block mb-1.5">Tech Stack</span>
                  <div className="flex flex-wrap gap-1.5">
                    {submission.tech_stack.map((tech, i) => (
                      <span key={i} className="px-2.5 py-1 bg-indigo-950/50 text-indigo-300 rounded border border-indigo-800/40 text-[11px] font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Team Members */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              Team Members ({membersList.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {membersList.map((m, i) => {
                const memberName = typeof m === 'string' ? m : m.name;
                const memberRole = typeof m === 'object' ? m.role : (i === 0 ? 'Team Lead' : 'Developer');
                const memberEmail = typeof m === 'object' ? m.email : `${memberName.toLowerCase().replace(/\s+/g, '')}@club.edu`;

                return (
                  <div key={i} className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-white text-xs">{memberName}</div>
                      <div className="text-[11px] text-indigo-400 font-medium">{memberRole}</div>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-2 truncate">
                      {memberEmail}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Official Round 1 Marks & Criterion Breakdown */}
          <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                Round 1 Official Marks (100 Max Points)
              </h3>
              {isEvaluated && (
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-500/30">
                  Total: {(Number(totalScore) || 0).toFixed(1)} / 100
                </span>
              )}
            </div>

            {isEvaluated ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(activeRubric?.criteria || []).map((criterion, idx) => {
                    const maxMarks = Number(criterion.max_marks || criterion.max_points) || 25;
                    const avgCrit = teamEvals.length > 0 ? (teamEvals.reduce((acc, ev) => {
                      let s = 0;
                      const list = ev.criteria_scores || ev.scores;
                      if (Array.isArray(list)) {
                        const found = list.find(item => item.criterion_id === criterion.id);
                        s = found ? found.score : 0;
                      } else if (list && typeof list === 'object') {
                        s = list[criterion.id] || 0;
                      }
                      return acc + (Number(s) || 0);
                    }, 0) / teamEvals.length) : 0;
                    const pct = Math.min(100, Math.round((avgCrit / maxMarks) * 100));

                    return (
                      <div key={criterion.id} className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-300">{idx + 1}. {criterion.name}</span>
                          <span className="font-mono font-bold text-indigo-400">{(Number(avgCrit) || 0).toFixed(1)} / {maxMarks}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1">
                          <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{criterion.description}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Judge Remarks */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Jury Remarks & Feedback</span>
                  {teamEvals.map((ev, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800/80 p-3 rounded-lg text-xs space-y-1.5">
                      {ev.strengths && (
                        <div>
                          <strong className="text-emerald-400 text-[11px]">Strengths: </strong>
                          <span className="text-slate-300 italic">&ldquo;{ev.strengths}&rdquo;</span>
                        </div>
                      )}
                      {ev.areas_for_improvement && (
                        <div>
                          <strong className="text-amber-400 text-[11px]">Areas for Improvement: </strong>
                          <span className="text-slate-300 italic">&ldquo;{ev.areas_for_improvement}&rdquo;</span>
                        </div>
                      )}
                      {ev.notes && (
                        <div>
                          <strong className="text-slate-400 text-[11px]">Notes: </strong>
                          <span className="text-slate-300 italic">&ldquo;{ev.notes}&rdquo;</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-900/60 rounded-lg text-center text-slate-400">
                <p>Round 1 marks entry is in progress by assigned judges.</p>
              </div>
            )}
          </div>

          {/* Attached Deliverable Links */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              Attached Project Resources
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <a
                href={submission.github_url || submission.repo_url || '#'}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between text-slate-300 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-indigo-400" />
                  <span className="font-semibold">GitHub Repo</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>

              <a
                href={submission.deck_url || submission.slide_deck_url || '#'}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between text-slate-300 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold">Pitch Deck</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>

              <a
                href={submission.demo_url || '#'}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between text-slate-300 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold">Live Demo</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </a>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            Room Coordinator: {roomCoordinator?.name} ({roomCoordinator?.phone || 'Room Alpha Desk'})
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors border border-slate-700"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}

export { TeamDossierModal };
