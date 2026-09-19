'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDataStore } from '@/lib/dataStore';
import { 
  ShieldCheck, 
  Award, 
  ClipboardCheck, 
  Users, 
  ArrowRight, 
  Lock,
  UserCheck
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginAs, teams, judges, coordinators } = useDataStore();
  
  const [selectedRole, setSelectedRole] = useState('admin');
  const [teamCodeInput, setTeamCodeInput] = useState('IDEA-01');
  const [judgeCodeInput, setJudgeCodeInput] = useState('JDG-01');
  const [coordCodeInput, setCoordCodeInput] = useState('CRD-01');

  const handleQuickLogin = (role, identifier, targetUrl) => {
    loginAs(role, identifier);
    router.push(targetUrl);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (selectedRole === 'admin') {
      loginAs('admin');
      router.push('/admin/dashboard');
    } else if (selectedRole === 'coordinator') {
      loginAs('coordinator', coordCodeInput);
      router.push('/coordinator/dashboard');
    } else if (selectedRole === 'judge') {
      loginAs('judge', judgeCodeInput);
      router.push('/judge/dashboard');
    } else {
      loginAs('team', teamCodeInput);
      router.push('/team/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6">
      <div className="clean-card max-w-xl w-full p-6 sm:p-8 space-y-8 bg-slate-900 border border-indigo-500/20 shadow-2xl">
        {/* Header */}
        <div className="border-b border-white/5 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-indigo">SESSION AUTHENTICATION</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            IdeaJudge Access Terminal
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Select your role to access your dedicated judging workspace.
          </p>
        </div>

        {/* 1-Click Fast Identity Selector */}
        <div className="space-y-3">
          <div className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider">
            QUICK 1-CLICK ROLE ACCESS
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Admin */}
            <button
              type="button"
              onClick={() => handleQuickLogin('admin', null, '/admin/dashboard')}
              className="p-3.5 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-indigo-500/30 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-indigo-400 text-xs font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Lead</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-indigo-500/10 rounded">ROOT</span>
              </div>
              <div className="text-xs text-slate-300 font-medium truncate">
                Event Lead ("Me")
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 group-hover:text-indigo-400">
                <span>Enter Admin HQ</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Judge */}
            <button
              type="button"
              onClick={() => handleQuickLogin('judge', 'JDG-01', '/judge/dashboard')}
              className="p-3.5 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-emerald-500/30 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-emerald-400 text-xs font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>Judge</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-500/10 rounded">JDG-01</span>
              </div>
              <div className="text-xs text-slate-300 font-medium truncate">
                Dr. Elena Rostova
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 group-hover:text-emerald-400">
                <span>Judge Terminal</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Coordinator */}
            <button
              type="button"
              onClick={() => handleQuickLogin('coordinator', 'CRD-01', '/coordinator/dashboard')}
              className="p-3.5 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-amber-500/30 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-amber-400 text-xs font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <ClipboardCheck className="w-3.5 h-3.5" />
                  <span>Coordinator</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-amber-500/10 rounded">CRD-01</span>
              </div>
              <div className="text-xs text-slate-300 font-medium truncate">
                Alex Morgan (Room A)
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 group-hover:text-amber-400">
                <span>Room Proctoring</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Team Leader */}
            <button
              type="button"
              onClick={() => handleQuickLogin('team', 'IDEA-01', '/team/dashboard')}
              className="p-3.5 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-white/10 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-slate-300 text-xs font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>Team Leader</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-white/10 rounded">IDEA-01</span>
              </div>
              <div className="text-xs text-slate-300 font-medium truncate">
                AetherAI Diagnostics
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 group-hover:text-white">
                <span>Team Portal</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>

        {/* Custom Role Selector & Form */}
        <div className="pt-6 border-t border-white/5 space-y-4">
          <div className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider">
            OR SELECT CUSTOM CREDENTIAL
          </div>

          <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1 rounded-lg border border-white/5">
            {[
              { id: 'admin', label: 'Admin' },
              { id: 'judge', label: 'Judge' },
              { id: 'coordinator', label: 'Coord' },
              { id: 'team', label: 'Team' }
            ].map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRole(r.id)}
                className={`py-2 text-xs font-semibold rounded-md transition-colors ${
                  selectedRole === r.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleCustomSubmit} className="space-y-4">
            {selectedRole === 'judge' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Judge Profile:
                </label>
                <select
                  value={judgeCodeInput}
                  onChange={(e) => setJudgeCodeInput(e.target.value)}
                  className="form-select"
                >
                  {judges.map(j => (
                    <option key={j.id} value={j.judge_code}>
                      [{j.judge_code}] {j.name} — {j.specialization}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedRole === 'coordinator' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Coordinator Profile:
                </label>
                <select
                  value={coordCodeInput}
                  onChange={(e) => setCoordCodeInput(e.target.value)}
                  className="form-select"
                >
                  {coordinators.map(c => (
                    <option key={c.id} value={c.coordinator_code}>
                      [{c.coordinator_code}] {c.name} — {c.assigned_room}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedRole === 'team' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Team / Squad:
                </label>
                <select
                  value={teamCodeInput}
                  onChange={(e) => setTeamCodeInput(e.target.value)}
                  className="form-select"
                >
                  {teams.map(t => (
                    <option key={t.id} value={t.team_code}>
                      [{t.team_code}] {t.name} ({t.room})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedRole === 'admin' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Admin Event Lead:
                </label>
                <input
                  type="text"
                  value="admin@club.edu (Event Lead)"
                  disabled
                  className="form-input opacity-70 cursor-not-allowed"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full btn-primary text-xs py-2.5 flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Launch {selectedRole.toUpperCase()} Workspace</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
