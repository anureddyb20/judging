'use client';

import React, { useState } from 'react';
import { useDataStore } from '@/lib/dataStore';
import {
  Grid,
  Zap,
  RotateCcw,
  CheckCircle2,
  Clock,
  UserCheck,
  Users,
  Search,
  AlertCircle
} from 'lucide-react';

export default function AdminAssignmentsPage() {
  const {
    teams,
    judges,
    assignments,
    evaluations,
    assignJudgeToTeam,
    removeJudgeAssignment,
    autoAssignJudges,
    clearAllAssignments,
    confirmAction
  } = useDataStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRatio, setSelectedRatio] = useState(2);

  const activeJudges = judges.filter(j => j.is_active);

  const filteredTeams = teams.filter(t =>
    t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.team_code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCellToggle = (judgeId, teamId) => {
    const isAssigned = assignments.some(a => a.judge_id === judgeId && a.team_id === teamId);
    if (isAssigned) {
      removeJudgeAssignment(judgeId, teamId);
    } else {
      assignJudgeToTeam(judgeId, teamId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="clean-card p-6 border border-indigo-500/20 bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-indigo">ASSIGNMENT ENGINE</span>
            <span className="text-xs font-mono text-slate-400">Team × Judge Allocation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Judge Assignment Matrix ({assignments.length} Total Allocations)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any cell in the grid to assign or unassign judges, or run the auto-balancer to evenly distribute evaluations.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-lg border border-white/10">
            <span className="text-[11px] font-mono text-slate-400 pl-2">Ratio:</span>
            <select
              value={selectedRatio}
              onChange={(e) => setSelectedRatio(Number(e.target.value))}
              className="bg-slate-900 border border-white/10 text-white text-xs rounded px-2 py-1 font-mono focus:outline-none"
            >
              <option value={1}>1 Judge / Team</option>
              <option value={2}>2 Judges / Team</option>
              <option value={3}>3 Judges / Team</option>
              <option value={4}>4 Judges / Team</option>
            </select>
            <button
              onClick={() => autoAssignJudges(selectedRatio)}
              className="btn-primary text-xs py-1 px-3 flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Auto-Assign</span>
            </button>
          </div>

          <button
            onClick={() => {
              confirmAction({
                title: 'Reset Assignments Grid',
                message: 'Are you sure you want to clear all judge assignments? All current team-to-judge links will be removed.',
                confirmText: 'Clear All',
                isDestructive: true,
                onConfirm: () => clearAllAssignments()
              });
            }}
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 text-rose-400 hover:text-rose-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Grid</span>
          </button>
        </div>
      </div>

      {/* Quick Judge Workload Bar */}
      <div className="clean-card p-4 bg-slate-900/80 border border-white/10 space-y-2">
        <div className="text-[11px] font-mono uppercase text-slate-400 font-bold flex items-center justify-between">
          <span>Active Judge Workload Distribution</span>
          <span>{activeJudges.length} Active Judges</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {activeJudges.map(j => {
            const count = assignments.filter(a => a.judge_id === j.id).length;
            const evalCount = evaluations.filter(e => e.judge_id === j.id && !e.is_draft).length;
            return (
              <div key={j.id} className="p-2.5 rounded-lg bg-slate-950 border border-white/5 space-y-1">
                <div className="text-xs font-bold text-white truncate" title={j.name}>{j.name}</div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-400">Assigned:</span>
                  <span className="text-indigo-400 font-bold">{count}</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-400">Done:</span>
                  <span className="text-emerald-400 font-bold">{evalCount}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search teams in matrix..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Matrix Table */}
      <div className="clean-card overflow-hidden border border-white/10 bg-slate-900/90">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 border-b border-white/10 font-mono text-slate-400">
              <tr>
                <th className="p-3.5 min-w-[200px] sticky left-0 z-20 bg-slate-950 border-r border-white/10">
                  TEAM / CODE
                </th>
                {activeJudges.map(judge => (
                  <th key={judge.id} className="p-3 text-center min-w-[130px] border-r border-white/5 font-mono">
                    <div className="text-white font-bold truncate max-w-[120px] mx-auto" title={judge.name}>
                      {judge.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal truncate max-w-[120px] mx-auto">
                      {(judge.assigned_room || judge.organization || 'Panel').split(' ')[0]}
                    </div>
                  </th>
                ))}
                <th className="p-3.5 text-center min-w-[90px]">ASSIGNED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-slate-950/40">
              {filteredTeams.map(team => {
                const teamAssignments = assignments.filter(a => a.team_id === team.id);
                return (
                  <tr key={team.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3.5 sticky left-0 z-10 bg-slate-950 border-r border-white/10">
                      <div className="font-bold text-white text-sm">{team.name}</div>
                      <div className="font-mono text-[11px] text-slate-400">{team.team_code} · {(team.room || 'General').split(' ')[0]}</div>
                    </td>

                    {activeJudges.map(judge => {
                      const assignment = assignments.find(a => a.judge_id === judge.id && a.team_id === team.id);
                      const evaluation = evaluations.find(e => e.judge_id === judge.id && e.team_id === team.id);

                      let cellContent = (
                        <span className="text-slate-600 font-mono text-sm select-none group-hover:text-slate-400">
                          +
                        </span>
                      );

                      let cellClass = "bg-transparent hover:bg-indigo-950/20";

                      if (assignment) {
                        if (evaluation && !evaluation.is_draft) {
                          cellContent = (
                            <span className="inline-flex items-center gap-1 font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 text-[11px]">
                              <CheckCircle2 className="w-3 h-3" />
                              {(Number(evaluation.total_score) || 0).toFixed(1)}
                            </span>
                          );
                          cellClass = "bg-emerald-950/10";
                        } else if (evaluation && evaluation.is_draft) {
                          cellContent = (
                            <span className="inline-flex items-center gap-1 font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 text-[10px]">
                              <Clock className="w-3 h-3" />
                              DRAFT
                            </span>
                          );
                          cellClass = "bg-amber-950/10";
                        } else {
                          cellContent = (
                            <span className="inline-flex items-center gap-1 font-mono text-indigo-300 bg-indigo-500/20 px-2.5 py-0.5 rounded border border-indigo-500/40 text-[11px]">
                              ASSIGNED
                            </span>
                          );
                          cellClass = "bg-indigo-950/20";
                        }
                      }

                      return (
                        <td
                          key={judge.id}
                          onClick={() => handleCellToggle(judge.id, team.id)}
                          className={`p-2.5 text-center border-r border-white/5 cursor-pointer transition-all group ${cellClass}`}
                          title={`Click to ${assignment ? 'unassign' : 'assign'} ${judge.name} to ${team.name}`}
                        >
                          {cellContent}
                        </td>
                      );
                    })}

                    <td className="p-3.5 text-center font-mono font-bold">
                      <span className={teamAssignments.length >= selectedRatio ? 'text-emerald-400' : 'text-amber-400'}>
                        {teamAssignments.length}
                      </span>
                      <span className="text-slate-600 font-normal"> / {selectedRatio}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
