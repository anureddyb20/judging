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
  Star,
  MapPin,
  Flame
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
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-r from-[#FF007F]/20 via-[#FF8A00]/15 to-[#00F0FF]/20 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="bracket-corners rockstar-card max-w-xl w-full p-7 sm:p-9 border border-[#FF007F]/40 bg-[#0d0322]/95 shadow-[0_15px_50px_rgba(0,0,0,0.9)] rounded-2xl">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-[#2b1050] pb-5 mb-7">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-[#FF007F] to-[#FF8A00] p-[2px] shadow-[0_0_15px_rgba(255,0,127,0.5)]">
              <div className="w-full h-full bg-[#0d0322] rounded-[6px] flex items-center justify-center text-[#FF007F]">
                <Terminal className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-white font-heading font-black text-xl tracking-wide flex items-center gap-2">
                <span>VICEVERSE TERMINAL</span>
                <span className="gta-vi-badge text-[9px]">VI</span>
              </div>
              <div className="text-[10px] font-mono text-[#00F0FF]">
                LEONIDA CLEARANCE PROTOCOL
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#39FF14] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-ping" />
            <span>NODE SECURE</span>
          </div>
        </div>

        {/* 1-Click Instant Demo Identities */}
        <div className="mb-8">
          <div className="text-[11px] font-mono font-black tracking-wider text-[#FF77BA] uppercase mb-3.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>QUICK-LAUNCH IDENTITIES (1-CLICK)</span>
            </div>
            <span className="text-[#9d8ec2] text-[10px]">DIRECT ACCESS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Team */}
            <button
              type="button"
              onClick={() => handleQuickLogin('team', 'VV-014', '/team/dashboard')}
              className="p-3.5 bg-gradient-to-b from-[#241104]/80 to-[#120826] border border-[#FFB800]/40 hover:border-[#FFB800] rounded-lg text-left transition-all group hover:shadow-[0_0_15px_rgba(255,184,0,0.3)]"
            >
              <div className="flex items-center justify-between text-[#FFB800] text-[10px] font-mono font-black mb-1">
                <span>CREW</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-[#070210] border border-[#FFB800]/40 rounded">VV-014</span>
              </div>
              <div className="text-white font-heading text-xs font-black truncate group-hover:text-[#FFB800] transition-colors">
                SYNTHETIC VANGUARD
              </div>
              <div className="text-[10px] font-mono text-[#c4b5fd] mt-1.5 flex items-center gap-1">
                <span>Enter Squad Hub</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-[#FFB800]" />
              </div>
            </button>

            {/* Judge */}
            <button
              type="button"
              onClick={() => handleQuickLogin('judge', 'JDG-01', '/judge/dashboard')}
              className="p-3.5 bg-gradient-to-b from-[#031d2e]/80 to-[#120826] border border-[#00F0FF]/40 hover:border-[#00F0FF] rounded-lg text-left transition-all group hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]"
            >
              <div className="flex items-center justify-between text-[#00F0FF] text-[10px] font-mono font-black mb-1">
                <span>JUDGE</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-[#070210] border border-[#00F0FF]/40 rounded">JDG-01</span>
              </div>
              <div className="text-white font-heading text-xs font-black truncate group-hover:text-[#00F0FF] transition-colors">
                DR. ROSTOVA
              </div>
              <div className="text-[10px] font-mono text-[#c4b5fd] mt-1.5 flex items-center gap-1">
                <span>Judge Terminal</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-[#00F0FF]" />
              </div>
            </button>

            {/* Admin */}
            <button
              type="button"
              onClick={() => handleQuickLogin('admin', null, '/admin/dashboard')}
              className="p-3.5 bg-gradient-to-b from-[#2e0419]/80 to-[#120826] border border-[#FF007F]/40 hover:border-[#FF007F] rounded-lg text-left transition-all group hover:shadow-[0_0_15px_rgba(255,0,127,0.3)]"
            >
              <div className="flex items-center justify-between text-[#FF007F] text-[10px] font-mono font-black mb-1">
                <span>COMMAND</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-[#070210] border border-[#FF007F]/40 rounded">ROOT</span>
              </div>
              <div className="text-white font-heading text-xs font-black truncate group-hover:text-[#FF77BA] transition-colors">
                COMMANDER VEX
              </div>
              <div className="text-[10px] font-mono text-[#c4b5fd] mt-1.5 flex items-center gap-1">
                <span>Leonida HQ</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-[#FF007F]" />
              </div>
            </button>
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="border-t border-[#2b1050] pt-6">
          <div className="text-[11px] font-mono text-[#c4b5fd] uppercase tracking-wider mb-3 font-bold">
            AUTHENTICATE BY ROLE
          </div>

          <div className="grid grid-cols-3 gap-2.5 mb-6">
            <button
              type="button"
              onClick={() => setSelectedRole('team')}
              className={`p-3 font-heading font-black text-xs uppercase flex items-center justify-center gap-1.5 rounded-lg border transition-all ${
                selectedRole === 'team'
                  ? 'bg-gradient-to-r from-[#FF8A00] to-[#FFB800] text-black border-[#FFB800] shadow-[0_0_15px_rgba(255,184,0,0.4)]'
                  : 'bg-[#140628] text-[#c4b5fd] border-[#301254] hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>CREW</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('judge')}
              className={`p-3 font-heading font-black text-xs uppercase flex items-center justify-center gap-1.5 rounded-lg border transition-all ${
                selectedRole === 'judge'
                  ? 'bg-gradient-to-r from-[#00F0FF] to-[#00B4D8] text-black border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                  : 'bg-[#140628] text-[#c4b5fd] border-[#301254] hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>JUDGE</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`p-3 font-heading font-black text-xs uppercase flex items-center justify-center gap-1.5 rounded-lg border transition-all ${
                selectedRole === 'admin'
                  ? 'bg-gradient-to-r from-[#FF007F] to-[#FF4593] text-white border-[#FF007F] shadow-[0_0_15px_rgba(255,0,127,0.4)]'
                  : 'bg-[#140628] text-[#c4b5fd] border-[#301254] hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>COMMAND</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleCustomSubmit} className="space-y-4 font-mono text-xs">
            {selectedRole === 'team' && (
              <div>
                <label className="block text-[#c4b5fd] font-bold mb-1.5 uppercase">
                  OPERATIVE SQUAD CODE:
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
                <label className="block text-[#c4b5fd] font-bold mb-1.5 uppercase">
                  SYNDICATE JUDGE CREDENTIAL:
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
                <label className="block text-[#c4b5fd] font-bold mb-1.5 uppercase">
                  ROOT COMMAND CLEARANCE:
                </label>
                <input
                  type="text"
                  value="admin@viceverse.com (Commander Vex)"
                  disabled
                  className="hud-input bg-[#100424] text-[#9d8ec2] cursor-not-allowed"
                />
              </div>
            )}

            <button
              type="submit"
              className={`w-full rockstar-btn py-3.5 text-xs font-black tracking-widest rounded-lg ${
                selectedRole === 'judge' 
                  ? 'rockstar-btn-cyan' 
                  : selectedRole === 'team' 
                  ? 'bg-gradient-to-r from-[#FF8A00] to-[#FFB800] text-black' 
                  : 'rockstar-btn-sunset'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>INITIALIZE {selectedRole.toUpperCase()} HEIST SESSION</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
