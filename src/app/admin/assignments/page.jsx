'use client';

import React, { useState } from 'react';
import { useDataStore } from '@/lib/dataStore';
import TerminalHeader from '@/components/layout/TerminalHeader';
import { 
  GitPullRequest, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  Filter,
  Check,
  X
} from 'lucide-react';

export default function AdminAssignmentsPage() {
  const { 
    teams, 
    judges, 
    assignments, 
    evaluations, 
    missions, 
    assignJudgeToTeam, 
    removeAssignment, 
    batchAutoAssign 
  } = useDataStore();

  const [selectedMission, setSelectedMission] = useState('ALL');

  const filteredTeams = selectedMission === 'ALL'
    ? teams
    : teams.filter(t => t.mission_id === selectedMission);

  const activeJudges = judges.filter(j => j.is_active);

  const handleToggleCell = (judgeId, teamId) => {
    const exists = assignments.some(a => a.judge_id === judgeId && a.team_id === teamId);
    if (exists) {
      removeAssignment(judgeId, teamId);
    } else {
      assignJudgeToTeam(judgeId, teamId);
    }
  };

  return (
    <div className="space-y-6">
      <TerminalHeader
        title="MATRIX ASSIGNMENT INTERFACE"
        subtitle="Cross-map syndicate judges with squads. Toggle individual review permissions or trigger batch load balancing."
        badgeText="ASSIGNMENTS COCKPIT"
        badgeColor="pink"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => batchAutoAssign(2)}
              className="rockstar-btn rockstar-btn-pink text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AUTO-DISTRIBUTE (2 PER SQUAD)</span>
            </button>
          </div>
        }
      />

      {/* Filter Track Bar */}
      <div className="flex items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-500" />
          <span className="text-zinc-400 font-bold uppercase">FILTER BY TRACK:</span>
        </div>

        <select
          value={selectedMission}
          onChange={(e) => setSelectedMission(e.target.value)}
          className="hud-select sm:w-64"
        >
          <option value="ALL">All Mission Tracks ({teams.length} Squads)</option>
          {missions.map(m => (
            <option key={m.id} value={m.id}>
              {m.code} — {m.title}
            </option>
          ))}
        </select>
      </div>

      {/* Matrix Grid Card */}
      <div className="bracket-corners rockstar-card border border-zinc-800 overflow-hidden bg-black/90 font-mono text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-zinc-800">
            <thead className="bg-zinc-950 text-zinc-400 uppercase text-[11px] border-b border-zinc-800">
              <tr>
                <th className="p-4 w-64 border-r border-zinc-800">SQUAD // TRACK</th>
                {activeJudges.map(j => (
                  <th key={j.id} className="p-4 text-center border-r border-zinc-800">
                    <div className="font-heading font-black text-white text-xs">{j.name}</div>
                    <div className="text-[10px] text-cyan-400 font-mono">{j.judge_code}</div>
                  </th>
                ))}
                <th className="p-4 text-center">ASSIGNED COUNT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {filteredTeams.map(team => {
                const mission = missions.find(m => m.id === team.mission_id);
                const teamAssignments = assignments.filter(a => a.team_id === team.id);

                return (
                  <tr key={team.id} className="hover:bg-zinc-900/30">
                    <td className="p-4 border-r border-zinc-800">
                      <div className="font-heading font-black text-white text-sm">
                        {team.name}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-yellow-400 font-bold">{team.team_code}</span>
                        <span 
                          className="text-[9px] px-1.5 py-0.2 rounded text-black font-bold uppercase"
                          style={{ background: mission?.badge_color || '#fdbf15' }}
                        >
                          {mission?.code}
                        </span>
                      </div>
                    </td>

                    {activeJudges.map(judge => {
                      const isAssigned = assignments.some(a => a.judge_id === judge.id && a.team_id === team.id);
                      const isEvaluated = evaluations.some(e => e.judge_id === judge.id && e.team_id === team.id && !e.is_draft);

                      return (
                        <td key={judge.id} className="p-4 text-center border-r border-zinc-800">
                          <button
                            onClick={() => handleToggleCell(judge.id, team.id)}
                            className={`w-9 h-9 rounded flex items-center justify-center mx-auto transition-all ${
                              isEvaluated
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                                : isAssigned
                                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                                : 'bg-zinc-900/40 text-zinc-700 border border-zinc-800 hover:border-zinc-500 hover:text-zinc-400'
                            }`}
                            title={isEvaluated ? 'Evaluation submitted. Click to unassign.' : isAssigned ? 'Assigned. Click to unassign.' : 'Click to assign judge.'}
                          >
                            {isEvaluated ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : isAssigned ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              <span className="text-xs text-zinc-700">+</span>
                            )}
                          </button>
                        </td>
                      );
                    })}

                    <td className="p-4 text-center font-bold">
                      <span className={`px-2 py-1 rounded text-xs ${
                        teamAssignments.length >= 2 ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                      }`}>
                        {teamAssignments.length} Judge{teamAssignments.length !== 1 ? 's' : ''}
                      </span>
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
