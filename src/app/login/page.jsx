'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDataStore } from '@/lib/dataStore';
import { 
  Terminal, 
  ShieldCheck, 
  UserCheck, 
  Users, 
  Key, 
  Lock, 
  ArrowRight, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginAs, currentUser, profiles, teams, judges } = useDataStore();
  
  const [selectedRole, setSelectedRole] = useState('team');
  const [teamCodeInput, setTeamCodeInput] = useState('VV-014');
  const [judgeCodeInput, setJudgeCodeInput] = useState('JDG-01');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const handleQuickLogin = (role, identifier, targetUrl) => {
    loginAs(role, identifier);
    router.push(targetUrl);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (selectedRole === 'admin') {
      loginAs('admin');
      router.push('/admin/dashboard');
    } else if (selectedRole === 'judge') {
      loginAs('judge', judgeCodeInput);
      router.push('/judge/dashboard');
    } else {
      loginAs('team', teamCodeInput);
      router.push('/team/dashboard');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 cyber-grid-bg">
      <div className="bracket-corners rockstar-card max-w-xl w-full p-6 sm:p-8 border border-[var(--border-gold)] bg-black/90 shadow-[0_0_50px_rgba(0,0,0,0.9)]">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[var(--primary)] text-black flex items-center justify-center font-heading font-black">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="text-white font-heading font-black text-lg tracking-wider">
                VICEVERSE TERMINAL AUTH
              </div>
              <div className="text-[10px] font-mono text-zinc-400">
                CLEARANCE VERIFICATION PROTOCOL
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-[var(--lime)] animate-ping" />
            <span>NODE ACTIVE</span>
          </div>
        </div>

        {/* 1-Click Instant Demo Identities */}
        <div className="mb-8">
          <div className="text-[11px] font-mono font-bold tracking-wider text-[var(--primary)] uppercase mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>QUICK-LAUNCH DEMO IDENTITIES (1-CLICK)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Team */}
            <button
              type="button"
              onClick={() => handleQuickLogin('team', 'VV-014', '/team/dashboard')}
              className="p-3 bg-yellow-950/20 border border-yellow-500/40 hover:border-yellow-400 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-yellow-400 text-[10px] font-mono font-bold mb-1">
                <span>OPERATIVE</span>
                <span className="text-[9px] px-1 bg-yellow-900/50">VV-014</span>
              </div>
              <div className="text-white font-heading text-xs font-bold truncate group-hover:text-yellow-300">
                SYNTHETIC VANGUARD
              </div>
              <div className="text-[10px] font-mono text-zinc-400 mt-1 flex items-center gap-1">
                <span>Enter Team Hub</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Judge */}
            <button
              type="button"
              onClick={() => handleQuickLogin('judge', 'JDG-01', '/judge/dashboard')}
              className="p-3 bg-cyan-950/20 border border-cyan-500/40 hover:border-cyan-400 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-cyan-400 text-[10px] font-mono font-bold mb-1">
                <span>JUDGE</span>
                <span className="text-[9px] px-1 bg-cyan-900/50">JDG-01</span>
              </div>
              <div className="text-white font-heading text-xs font-bold truncate group-hover:text-cyan-300">
                DR. ELENA ROSTOVA
              </div>
              <div className="text-[10px] font-mono text-zinc-400 mt-1 flex items-center gap-1">
                <span>Judge Terminal</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Admin */}
            <button
              type="button"
              onClick={() => handleQuickLogin('admin', null, '/admin/dashboard')}
              className="p-3 bg-red-950/20 border border-red-500/40 hover:border-red-400 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-red-400 text-[10px] font-mono font-bold mb-1">
                <span>ROOT ADMIN</span>
                <span className="text-[9px] px-1 bg-red-900/50">ROOT</span>
              </div>
              <div className="text-white font-heading text-xs font-bold truncate group-hover:text-red-300">
                COMMANDER VEX
              </div>
              <div className="text-[10px] font-mono text-zinc-400 mt-1 flex items-center gap-1">
                <span>Command HQ</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="border-t border-zinc-800 pt-6">
          <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-3">
            AUTHENTICATE BY ROLE
          </div>

          <div className="grid grid-cols-3 gap-2 mb-6">
            <button
              type="button"
              onClick={() => setSelectedRole('team')}
              className={`p-2.5 font-mono text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                selectedRole === 'team'
                  ? 'bg-[var(--primary)] text-black border-[var(--primary)] shadow-[0_0_15px_rgba(253,191,21,0.3)]'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>OPERATIVE</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('judge')}
              className={`p-2.5 font-mono text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                selectedRole === 'judge'
                  ? 'bg-[var(--cyan)] text-black border-[var(--cyan)] shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>JUDGE</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`p-2.5 font-mono text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                selectedRole === 'admin'
                  ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-[0_0_15px_rgba(255,0,127,0.3)]'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>COMMANDER</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleCustomSubmit} className="space-y-4 font-mono text-xs">
            {selectedRole === 'team' && (
              <div>
                <label className="block text-zinc-400 font-bold mb-1.5 uppercase">
                  TEAM IDENTIFIER OR CODE:
                </label>
                <select
                  value={teamCodeInput}
                  onChange={(e) => setTeamCodeInput(e.target.value)}
                  className="hud-select mb-2"
                >
                  {teams.map(t => (
                    <option key={t.id} value={t.team_code}>
                      [{t.team_code}] {t.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedRole === 'judge' && (
              <div>
                <label className="block text-zinc-400 font-bold mb-1.5 uppercase">
                  SELECT JUDGE CREDENTIAL:
                </label>
                <select
                  value={judgeCodeInput}
                  onChange={(e) => setJudgeCodeInput(e.target.value)}
                  className="hud-select mb-2"
                >
                  {judges.map(j => (
                    <option key={j.id} value={j.judge_code}>
                      [{j.judge_code}] {j.name} — {j.organization}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedRole === 'admin' && (
              <div>
                <label className="block text-zinc-400 font-bold mb-1.5 uppercase">
                  ROOT ADMIN ACCESS:
                </label>
                <input
                  type="text"
                  value="admin@viceverse.com (Commander Vex)"
                  disabled
                  className="hud-input bg-zinc-900/50 text-zinc-400 cursor-not-allowed"
                />
              </div>
            )}

            <button
              type="submit"
              className={`w-full rockstar-btn py-3 text-xs tracking-widest ${
                selectedRole === 'judge' ? 'rockstar-btn-cyan' : selectedRole === 'admin' ? 'rockstar-btn-pink' : ''
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>INITIALIZE {selectedRole.toUpperCase()} SESSION</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
