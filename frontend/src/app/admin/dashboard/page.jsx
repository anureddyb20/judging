'use client';

import React from 'react';
import Link from 'next/link';
import { useDataStore } from '@/lib/dataStore';
import { computeAdminTelemetry, computeLeaderboard } from '@/lib/scoring';
import TerminalHeader from '@/components/layout/TerminalHeader';
import { 
  Users, 
  UserCheck, 
  FileText, 
  Award, 
  Activity, 
  Sliders, 
  Radio, 
  ArrowRight, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2,
  Lock,
  Unlock,
  Eye,
  EyeOff
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminDashboard() {
  const { 
    teams, 
    judges, 
    assignments, 
    evaluations, 
    submissions, 
    eventSettings, 
    updateEventSettings,
    auditLogs,
    missions,
    rubrics 
  } = useDataStore();

  const telemetry = computeAdminTelemetry(teams, judges, assignments, evaluations, submissions);
  const activeRubric = rubrics.find(r => r.is_active) || rubrics[0];
  const rankedLeaderboard = computeLeaderboard(teams, evaluations, activeRubric?.criteria, eventSettings.scoring_method);

  const activeJudges = judges.filter(j => j.is_active);

  return (
    <div className="space-y-6">
      <TerminalHeader
        title="COMMAND CENTER TELEMETRY"
        subtitle="Real-time multi-agent heist control, live scoring aggregation, and syndicate status."
        badgeText="ROOT COMMAND HUD"
        badgeColor="pink"
        actions={
          <div className="flex items-center gap-2">
            <Link href="/admin/settings" className="rockstar-btn rockstar-btn-outline text-xs py-2 px-3">
              <Sliders className="w-3.5 h-3.5" />
              <span>Event Controls</span>
            </Link>
            <Link href="/admin/announcements" className="rockstar-btn rockstar-btn-pink text-xs py-2 px-3">
              <Radio className="w-3.5 h-3.5" />
              <span>Broadcast Alert</span>
            </Link>
          </div>
        }
      />

      {/* Top 4 Telemetry Stat Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="bracket-corners rockstar-card p-4 border border-zinc-800 bg-zinc-950/80">
          <div className="text-[10px] text-zinc-500 uppercase flex items-center justify-between">
            <span>REGISTERED SQUADS</span>
            <Users className="w-3.5 h-3.5 text-yellow-400" />
          </div>
          <div className="text-3xl font-black text-white mt-1">
            {telemetry.totalTeams}
          </div>
          <div className="text-[10px] text-zinc-400 mt-1">
            {telemetry.totalSubmissions} Project Blueprint(s)
          </div>
        </div>

        <div className="bracket-corners rockstar-card p-4 border border-zinc-800 bg-zinc-950/80">
          <div className="text-[10px] text-zinc-500 uppercase flex items-center justify-between">
            <span>SYNDICATE JUDGES</span>
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white mt-1">
            {telemetry.totalJudges}
          </div>
          <div className="text-[10px] text-cyan-400 mt-1">
            {activeJudges.length} Active in Enclave
          </div>
        </div>

        <div className="bracket-corners rockstar-card p-4 border border-zinc-800 bg-zinc-950/80">
          <div className="text-[10px] text-zinc-500 uppercase flex items-center justify-between">
            <span>JUDGING COMPLETION</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 mt-1">
            {telemetry.completionRate}%
          </div>
          <div className="text-[10px] text-zinc-400 mt-1">
            {telemetry.completedAssignments} / {telemetry.totalAssignments} Reviews Done
          </div>
        </div>

        <div className="bracket-corners rockstar-card p-4 border border-zinc-800 bg-zinc-950/80">
          <div className="text-[10px] text-zinc-500 uppercase flex items-center justify-between">
            <span>AVERAGE MARK</span>
            <Award className="w-3.5 h-3.5 text-yellow-400" />
          </div>
          <div className="text-3xl font-black text-yellow-400 mt-1">
            {telemetry.averageScore}
          </div>
          <div className="text-[10px] text-zinc-400 mt-1">
            Peak: {telemetry.highestScore} / 100
          </div>
        </div>
      </div>

      {/* Quick Heist State Toggle Bar */}
      <div className="bracket-corners rockstar-card p-4 border border-zinc-800 bg-black/80 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--lime)] animate-ping" />
          <span className="text-zinc-300 font-bold uppercase">FAST EVENT TOGGLES:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => updateEventSettings({ show_live_score: !eventSettings.show_live_score })}
            className={`px-3 py-1.5 border rounded flex items-center gap-1.5 font-bold transition-all ${
              eventSettings.show_live_score 
                ? 'bg-emerald-950 text-emerald-300 border-emerald-700' 
                : 'bg-zinc-900 text-zinc-500 border-zinc-700'
            }`}
          >
            {eventSettings.show_live_score ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>LIVE SCORES: {eventSettings.show_live_score ? 'VISIBLE' : 'HIDDEN'}</span>
          </button>

          <button
            onClick={() => updateEventSettings({ show_leaderboard: !eventSettings.show_leaderboard })}
            className={`px-3 py-1.5 border rounded flex items-center gap-1.5 font-bold transition-all ${
              eventSettings.show_leaderboard 
                ? 'bg-cyan-950 text-cyan-300 border-cyan-700' 
                : 'bg-zinc-900 text-zinc-500 border-zinc-700'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>LEADERBOARD: {eventSettings.show_leaderboard ? 'PUBLIC' : 'MASKED'}</span>
          </button>

          <button
            onClick={() => updateEventSettings({ submissions_locked: !eventSettings.submissions_locked })}
            className={`px-3 py-1.5 border rounded flex items-center gap-1.5 font-bold transition-all ${
              eventSettings.submissions_locked 
                ? 'bg-red-950 text-red-300 border-red-700' 
                : 'bg-zinc-900 text-zinc-400 border-zinc-700'
            }`}
          >
            {eventSettings.submissions_locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span>SUBMISSIONS: {eventSettings.submissions_locked ? 'LOCKED' : 'OPEN'}</span>
          </button>
        </div>
      </div>

      {/* Live Judging Progress Matrix Grid */}
      <div className="bracket-corners rockstar-card p-6 border border-zinc-800 bg-zinc-950/90 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-black text-white text-lg">
              LIVE JUDGING PROGRESS MATRIX
            </h3>
            <p className="font-mono text-xs text-zinc-400 mt-0.5">
              Cross-examination telemetry of judges across all squads.
            </p>
          </div>
          <Link href="/admin/assignments" className="text-xs font-mono font-bold text-yellow-400 hover:text-white flex items-center gap-1">
            <span>Manage Matrix</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border border-zinc-800">
            <thead className="bg-zinc-950 text-zinc-400 text-[11px] uppercase border-b border-zinc-800">
              <tr>
                <th className="p-3">SQUAD</th>
                {activeJudges.map(judge => (
                  <th key={judge.id} className="p-3 text-center">
                    <div>{judge.name.split(' ')[0]}</div>
                    <div className="text-[9px] text-zinc-500 font-normal">{judge.judge_code}</div>
                  </th>
                ))}
                <th className="p-3 text-right">AGGREGATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 bg-black/60">
              {teams.map(team => {
                const teamLeaderboard = rankedLeaderboard.find(t => t.id === team.id);
                return (
                  <tr key={team.id} className="hover:bg-zinc-900/40">
                    <td className="p-3 font-bold text-white">
                      <div>{team.name}</div>
                      <div className="text-[10px] text-zinc-500 font-normal">{team.team_code}</div>
                    </td>

                    {activeJudges.map(judge => {
                      const assignment = assignments.find(a => a.judge_id === judge.id && a.team_id === team.id);
                      const evalRecord = evaluations.find(e => e.judge_id === judge.id && e.team_id === team.id);

                      if (!assignment) {
                        return (
                          <td key={judge.id} className="p-3 text-center text-zinc-700">
                            -
                          </td>
                        );
                      }

                      if (evalRecord && !evalRecord.is_draft) {
                        return (
                          <td key={judge.id} className="p-3 text-center">
                            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-bold">
                              {evalRecord.total_score}
                            </span>
                          </td>
                        );
                      }

                      if (evalRecord && evalRecord.is_draft) {
                        return (
                          <td key={judge.id} className="p-3 text-center">
                            <span className="px-2 py-0.5 bg-amber-950 text-amber-400 border border-amber-800 rounded">
                              DRAFT
                            </span>
                          </td>
                        );
                      }

                      return (
                        <td key={judge.id} className="p-3 text-center">
                          <span className="px-2 py-0.5 bg-zinc-900 text-zinc-500 border border-zinc-800 rounded text-[10px]">
                            PENDING
                          </span>
                        </td>
                      );
                    })}

                    <td className="p-3 text-right font-black text-yellow-400 text-sm">
                      {teamLeaderboard ? teamLeaderboard.score.toFixed(1) : '0.0'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security & Audit Trail Snippet */}
      <div className="bracket-corners rockstar-card p-5 border border-zinc-800 bg-zinc-950/80 space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-red-400" />
            <span className="font-heading font-black text-white text-sm">
              RECENT AUDIT EVENTS
            </span>
          </div>
          <Link href="/admin/audit" className="text-xs font-mono text-zinc-400 hover:text-white">
            View Full Trail &gt;
          </Link>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {auditLogs.slice(0, 4).map(log => (
            <div key={log.id} className="flex items-center justify-between p-2 bg-black/50 border border-zinc-900 text-zinc-300">
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-yellow-300 font-bold">
                  {log.action}
                </span>
                <span className="text-zinc-400 text-[11px]">{log.user_email}</span>
              </div>
              <span className="text-[10px] text-zinc-500">{formatDate(log.created_at)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
