'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Award, 
  UserCheck, 
  Users, 
  ClipboardCheck, 
  ArrowRight, 
  BarChart3, 
  Clock, 
  Layers, 
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Compass,
  FileSpreadsheet
} from 'lucide-react';
import { useDataStore } from '@/lib/dataStore';
import { computeLeaderboard } from '@/lib/scoring';

export default function LandingLaunchpad() {
  const { 
    eventSettings, 
    missions, 
    teams, 
    judges, 
    coordinators, 
    evaluations, 
    rubrics, 
    loginAs 
  } = useDataStore();

  const activeRubric = rubrics.find(r => r.is_active) || rubrics[0];
  const totalEvaluations = evaluations.filter(e => !e.is_draft).length;
  const totalPossible = teams.length * judges.length;
  const progressPct = totalPossible > 0 ? Math.round((totalEvaluations / totalPossible) * 100) : 0;

  const roles = [
    {
      id: 'admin',
      title: 'Admin Control Center',
      subtitle: 'Event Lead / Organizer ("Me")',
      description: 'Master scoring matrix across all judges, dynamic rubric weights builder, lock & visibility controls, and export for awards.',
      badge: 'ROOT LEAD',
      badgeColor: 'badge-indigo',
      icon: ShieldCheck,
      iconBg: 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20',
      actionText: 'Launch As Admin Lead',
      actionUrl: '/admin/dashboard',
      loginRole: 'admin',
      loginIdentifier: null
    },
    {
      id: 'judge',
      title: 'Judge Evaluation Terminal',
      subtitle: 'Faculty & Industry Mentors',
      description: 'Review assigned teams, enter criterion marks with descriptions, compute live total scores, and record constructive feedback.',
      badge: 'EVALUATOR',
      badgeColor: 'badge-emerald',
      icon: Award,
      iconBg: 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20',
      actionText: 'Launch As Judge (Dr. Elena)',
      actionUrl: '/judge/dashboard',
      loginRole: 'judge',
      loginIdentifier: 'JDG-01'
    },
    {
      id: 'coordinator',
      title: 'Club Coordinator Hub',
      subtitle: 'Student Track & Room Managers',
      description: 'Manage presentation queue, track check-ins, time team pitches, and monitor live judge scoring completion in real-time.',
      badge: 'COORDINATOR',
      badgeColor: 'badge-amber',
      icon: ClipboardCheck,
      iconBg: 'bg-amber-600/10 text-amber-400 border-amber-500/20',
      actionText: 'Launch As Coordinator (Room A)',
      actionUrl: '/coordinator/dashboard',
      loginRole: 'coordinator',
      loginIdentifier: 'CRD-01'
    },
    {
      id: 'team',
      title: 'Team Leader Portal',
      subtitle: 'Participating Project Leads',
      description: 'Inspect project blueprint links, check scheduled pitch slot & room, and view final score breakdown with judge feedback.',
      badge: 'TEAM LEAD',
      badgeColor: 'badge-slate',
      icon: Users,
      iconBg: 'bg-slate-600/10 text-slate-300 border-slate-500/20',
      actionText: 'Launch As Team (AetherAI)',
      actionUrl: '/team/dashboard',
      loginRole: 'team',
      loginIdentifier: 'IDEA-01'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Event Header Banner */}
      <div className="clean-card p-6 sm:p-8 border border-indigo-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE ROUND: {eventSettings.event_phase}</span>
              <span>·</span>
              <span>{teams.length} Registered Teams</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {eventSettings.event_name}
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Dedicated digital judging system. Seamlessly coordinate team pitches, record multi-criterion scores, and generate automated leaderboards in real time.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950/80 p-3.5 rounded-lg border border-white/5">
              <div className="text-[11px] text-slate-400 font-mono">ACTIVE TRACKS</div>
              <div className="text-2xl font-bold text-white mt-0.5">{missions.length}</div>
            </div>
            <div className="bg-slate-950/80 p-3.5 rounded-lg border border-white/5">
              <div className="text-[11px] text-slate-400 font-mono">PANEL JUDGES</div>
              <div className="text-2xl font-bold text-white mt-0.5">{judges.length}</div>
            </div>
            <div className="bg-slate-950/80 p-3.5 rounded-lg border border-white/5 col-span-2 sm:col-span-1">
              <div className="text-[11px] text-slate-400 font-mono">SCORED ENTRIES</div>
              <div className="text-2xl font-bold text-indigo-400 mt-0.5">{evaluations.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Launchpad Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Select Your Portal
            </h2>
            <p className="text-xs text-slate-400">
              Direct role-based workspace entry for organizers, evaluators, and participants.
            </p>
          </div>
          <Link
            href="/leaderboard"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            <span>View Live Standings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.id}
                className="clean-card p-6 flex flex-col justify-between hover:border-indigo-500/40 transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${r.iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={r.badgeColor}>{r.badge}</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {r.title}
                    </h3>
                    <div className="text-xs font-medium text-slate-400 mb-2">
                      {r.subtitle}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {r.description}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => {
                      loginAs(r.loginRole, r.loginIdentifier);
                      window.location.href = r.actionUrl;
                    }}
                    className="w-full btn-primary text-xs py-2.5 flex items-center justify-center gap-2"
                  >
                    <span>{r.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Overview Sections: Problem Tracks & Rubrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Rubric Criteria Summary */}
        <div className="clean-card p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Active Scoring Rubric
              </h3>
              <p className="text-xs text-slate-400">
                Standardized criteria used by judges for grading pitches.
              </p>
            </div>
            <span className="badge-indigo">100 Max Points</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {activeRubric?.criteria?.map((c, i) => (
              <div key={c.id} className="p-3.5 rounded-lg bg-slate-900/90 border border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{c.name}</span>
                  <span className="text-xs font-mono font-bold text-indigo-400">{c.max_marks} Pts</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                  {c.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Presentation Queue */}
        <div className="clean-card p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Pitch Schedule
                </h3>
                <p className="text-xs text-slate-400">Current room status</p>
              </div>
              <span className="badge-emerald">Live</span>
            </div>

            <div className="space-y-2.5 pt-3">
              {teams.slice(0, 3).map((team) => (
                <div key={team.id} className="p-2.5 rounded-md bg-slate-900 border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">{team.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{team.pitch_slot} · {team.room}</div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    team.pitch_status === 'presenting' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse' :
                    team.pitch_status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {team.pitch_status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/coordinator/dashboard"
            className="w-full btn-secondary text-xs py-2 text-center"
          >
            Manage Pitch Queue
          </Link>
        </div>
      </div>
    </div>
  );
}
