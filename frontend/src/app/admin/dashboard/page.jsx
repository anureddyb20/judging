'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDataStore } from '@/features/shared/services/storage/dataStore';
import { computeAdminTelemetry, computeLeaderboard } from '@/features/shared/services/scoring/scoringEngine';
import { 
  Users, 
  UserCheck, 
  Activity, 
  Download, 
  Sliders, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Award,
  Clock,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import TeamDossierModal from '@/components/ui/TeamDossierModal';

export default function AdminDashboard() {
  const { 
    teams, 
    judges, 
    assignments, 
    evaluations, 
    eventSettings, 
    updateEventSettings,
    missions,
    rubrics,
    showToast 
  } = useDataStore();

  const telemetry = computeAdminTelemetry(teams, judges, assignments, evaluations, teams.map(t => t.submission));
  const activeRubric = rubrics.find(r => r.is_active) || rubrics[0];
  const rankedLeaderboard = computeLeaderboard(teams, evaluations, activeRubric?.criteria, eventSettings.scoring_method);
  const activeJudges = judges.filter(j => j.is_active);
  const [activeModalTeam, setActiveModalTeam] = useState(null);

  const pendingReviews = assignments.length > 0
    ? Math.max(0, assignments.length - evaluations.filter(e => !e.is_draft).length)
    : 0;
  const completionRate = telemetry?.completionRate !== undefined && !isNaN(telemetry.completionRate)
    ? telemetry.completionRate
    : (assignments.length > 0 ? Math.round((evaluations.filter(e => !e.is_draft).length / assignments.length) * 100) : 0);

  // Export Master Scorecard CSV
  const handleExportCSV = () => {
    let csv = 'Rank,Team Code,Team Name,Track,Room,Pitch Slot,';
    activeJudges.forEach(j => {
      csv += `${j.name} (${j.judge_code}),`;
    });
    csv += 'Aggregate Final Score (/100)\n';

    rankedLeaderboard.forEach(t => {
      const mission = missions.find(m => m.id === t.mission_id);
      let row = `${t.rank},"${t.team_code}","${t.name}","${mission?.title || ''}","${t.room || ''}","${t.pitch_slot || ''}",`;
      activeJudges.forEach(j => {
        const ev = evaluations.find(e => e.judge_id === j.id && e.team_id === t.id);
        row += ev && !ev.is_draft ? `${(Number(ev.total_score) || 0).toFixed(1)},` : '-,';
      });
      row += `${(Number(t.score) || 0).toFixed(1)}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ideathon_master_scores_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Master evaluation scorecard downloaded', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header */}
      <div className="clean-card p-6 border border-white/10 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full tracking-wider uppercase">
              ADMIN CONTROL CENTER
            </span>
            <span className="text-[11px] font-mono text-slate-400">· Real-Time Scoring Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ideathon Command & Scoring Overview
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Live cross-tabulated evaluations, team progression, and event visibility governance.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-semibold border border-white/10 flex items-center gap-2 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export CSV Scores</span>
          </button>
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Sync Active</span>
          </div>
        </div>
      </div>

      {/* Top 4 Telemetry Stat Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="clean-card p-5 bg-slate-900/90 border border-white/10 space-y-2 hover:border-indigo-500/30 transition-all">
          <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold flex items-center justify-between">
            <span>REGISTERED TEAMS</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">
            {teams.length}
          </div>
          <div className="text-[11px] text-slate-400">
            Across {missions.length} problem tracks
          </div>
        </div>

        <div className="clean-card p-5 bg-slate-900/90 border border-white/10 space-y-2 hover:border-emerald-500/30 transition-all">
          <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold flex items-center justify-between">
            <span>PANEL JUDGES</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">
            {judges.length}
          </div>
          <div className="text-[11px] text-emerald-400 font-medium">
            {activeJudges.length} Active on Duty
          </div>
        </div>

        <div className="clean-card p-5 bg-slate-900/90 border border-white/10 space-y-2 hover:border-amber-500/30 transition-all">
          <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold flex items-center justify-between">
            <span>EVALUATIONS DONE</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">
            {evaluations.filter(e => !e.is_draft).length}
          </div>
          <div className="text-[11px] text-slate-400">
            {pendingReviews} pending scorecards
          </div>
        </div>

        <div className="clean-card p-5 bg-slate-900/90 border border-white/10 space-y-2 hover:border-indigo-500/30 transition-all">
          <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold flex items-center justify-between">
            <span>COMPLETION RATE</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-indigo-400">
            {completionRate}%
          </div>
          <div className="text-[11px] text-slate-400">
            Overall progress
          </div>
        </div>
      </div>

      {/* Quick Visibility & Lock Controls Bar */}
      <div className="clean-card p-4 sm:p-5 bg-slate-900/90 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <span className="text-xs font-bold font-mono text-white uppercase tracking-wider flex items-center gap-1.5">
            <span>Live Visibility Controls</span>
            <span className="text-slate-500 font-normal">· Real-Time Broadcast</span>
          </span>
          <p className="text-[11px] text-slate-400">
            Directly governs visibility for teams and the public leaderboard.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Live Score Toggle */}
          <button
            onClick={() => updateEventSettings({ show_live_score: !eventSettings.show_live_score })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              eventSettings.show_live_score 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
                : 'bg-slate-800 text-slate-400 border-white/5 hover:bg-slate-700'
            }`}
          >
            {eventSettings.show_live_score ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Live Scores: {eventSettings.show_live_score ? 'Visible' : 'Masked'}</span>
          </button>

          {/* Leaderboard Toggle */}
          <button
            onClick={() => updateEventSettings({ show_leaderboard: !eventSettings.show_leaderboard })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              eventSettings.show_leaderboard 
                ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/20' 
                : 'bg-slate-800 text-slate-400 border-white/5 hover:bg-slate-700'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Leaderboard: {eventSettings.show_leaderboard ? 'Public' : 'Hidden'}</span>
          </button>

          {/* Results Lock Toggle */}
          <button
            onClick={() => updateEventSettings({ results_locked: !eventSettings.results_locked })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              eventSettings.results_locked 
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20' 
                : 'bg-slate-800 text-slate-400 border-white/10 hover:bg-slate-700'
            }`}
          >
            {eventSettings.results_locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span>Standings: {eventSettings.results_locked ? 'Locked' : 'Unlocked'}</span>
          </button>
        </div>
      </div>

      {/* Master Real-Time Judge Evaluation Matrix */}
      <div className="clean-card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-white/5 bg-slate-950 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Master Judge Evaluation Matrix
            </h2>
            <p className="text-xs text-slate-400">
              Live score cross-tabulation across all panel judges.
            </p>
          </div>
          <span className="text-xs font-mono text-indigo-400">
            Scoring Formula: {eventSettings.scoring_method.toUpperCase()}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-mono border-b border-white/5">
              <tr>
                <th className="p-3.5 w-16">RANK</th>
                <th className="p-3.5">TEAM / SQUAD</th>
                {activeJudges.map(judge => (
                  <th key={judge.id} className="p-3.5 text-center">
                    <div>{judge.judge_code}</div>
                    <div className="text-[9px] text-slate-500 font-sans font-normal truncate max-w-[100px]">{judge.name}</div>
                  </th>
                ))}
                <th className="p-3.5 text-right font-bold text-indigo-400">AGGREGATE (/100)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-slate-950/60">
              {teams.map(team => {
                const teamLeaderboard = rankedLeaderboard.find(t => t.id === team.id);
                return (
                  <tr 
                    key={team.id} 
                    onClick={() => setActiveModalTeam(team)}
                    className="hover:bg-indigo-950/30 transition-colors cursor-pointer group"
                    title="Click to view complete team dossier, problem statement, members, and marks"
                  >
                    <td className="p-3.5 font-mono font-bold text-slate-400">
                      #{teamLeaderboard?.rank || '-'}
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                        <span>{team.name}</span>
                        <span className="text-[10px] text-indigo-400 font-normal underline">view</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">{team.team_code} · {team.room}</div>
                    </td>

                    {activeJudges.map(judge => {
                      const assignment = assignments.find(a => a.judge_id === judge.id && a.team_id === team.id);
                      const evalRecord = evaluations.find(e => e.judge_id === judge.id && e.team_id === team.id);

                      if (!assignment) {
                        return (
                          <td key={judge.id} className="p-3.5 text-center text-slate-600 font-mono">
                            -
                          </td>
                        );
                      }

                      if (evalRecord && !evalRecord.is_draft) {
                        return (
                          <td key={judge.id} className="p-3.5 text-center">
                            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded font-mono font-bold">
                              {(Number(evalRecord.total_score) || 0).toFixed(1)}
                            </span>
                          </td>
                        );
                      }

                      if (evalRecord && evalRecord.is_draft) {
                        return (
                          <td key={judge.id} className="p-3.5 text-center">
                            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded text-[10px] font-mono">
                              DRAFT
                            </span>
                          </td>
                        );
                      }

                      return (
                        <td key={judge.id} className="p-3.5 text-center">
                          <span className="px-2 py-0.5 bg-slate-900 text-slate-500 border border-white/5 rounded text-[10px] font-mono">
                            PENDING
                          </span>
                        </td>
                      );
                    })}

                    <td className="p-3.5 text-right font-mono font-bold text-base text-indigo-400">
                      {teamLeaderboard ? (Number(teamLeaderboard.score) || 0).toFixed(1) : '0.0'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complete Team Dossier Modal */}
      <TeamDossierModal
        team={activeModalTeam}
        isOpen={!!activeModalTeam}
        onClose={() => setActiveModalTeam(null)}
      />
    </div>
  );
}
