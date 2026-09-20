'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDataStore } from '@/lib/dataStore';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { 
  ShieldCheck, 
  Award, 
  ClipboardCheck, 
  Users, 
  ArrowRight, 
  Lock, 
  Sparkles,
  CheckCircle2,
  KeyRound,
  UserCheck,
  Building,
  Clock
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginAs, teams, judges, coordinators, missions, eventSettings } = useDataStore();
  
  const [selectedRole, setSelectedRole] = useState('admin');
  const [customIdentifier, setCustomIdentifier] = useState('IDEA-01');
  const [passcode, setPasscode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role === 'admin') setCustomIdentifier('admin');
    else if (role === 'judge') setCustomIdentifier('JDG-01');
    else if (role === 'coordinator') setCustomIdentifier('CRD-01');
    else if (role === 'team') setCustomIdentifier('IDEA-01');
  };

  const handleQuickLogin = (role, identifier, targetUrl) => {
    setIsLoading(true);
    loginAs(role, identifier);
    setTimeout(() => {
      router.push(targetUrl);
    }, 400);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    let target = '/';
    if (selectedRole === 'admin') {
      loginAs('admin');
      target = '/admin/dashboard';
    } else if (selectedRole === 'judge') {
      loginAs('judge', customIdentifier);
      target = '/judge/dashboard';
    } else if (selectedRole === 'coordinator') {
      loginAs('coordinator', customIdentifier);
      target = '/coordinator/dashboard';
    } else {
      loginAs('team', customIdentifier);
      target = '/team/dashboard';
    }

    setTimeout(() => {
      router.push(target);
    }, 400);
  };

  const roleConfigs = [
    {
      id: 'admin',
      title: 'Admin Lead',
      subtitle: 'Event Organizer & Jury Lead ("Me")',
      icon: ShieldCheck,
      badge: 'ROOT CONTROL',
      color: 'indigo',
      target: '/admin/dashboard',
      defaultId: 'admin',
      desc: 'Master scoring matrix, rubric weightages, judge assignments, lock & CSV export.'
    },
    {
      id: 'judge',
      title: 'Panel Judge',
      subtitle: 'Technical Jury & Evaluator',
      icon: Award,
      badge: 'JURY PORTAL',
      color: 'emerald',
      target: '/judge/dashboard',
      defaultId: 'JDG-01',
      desc: 'Assigned pitch queue, 100-pt criterion sliders, instant score calculation & feedback.'
    },
    {
      id: 'coordinator',
      title: 'Club Coordinator',
      subtitle: 'Room Lead & Timekeeper',
      icon: ClipboardCheck,
      badge: 'OPERATIONS',
      color: 'cyan',
      target: '/coordinator/dashboard',
      defaultId: 'CRD-01',
      desc: 'Room pitch queue, 5m pitch + 3m Q&A interactive timer, team attendance check-in.'
    },
    {
      id: 'team',
      title: 'Team Leader',
      subtitle: 'Participant Squad Portal',
      icon: Users,
      badge: 'PARTICIPANT',
      color: 'amber',
      target: '/team/dashboard',
      defaultId: 'IDEA-01',
      desc: 'Project blueprint, room & pitch slot schedule, live criterion marks breakdown.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero & System Information (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-md">
                  AUTHENTICATION GATEWAY
                </span>
                <span className="text-xs text-slate-400">Club Ideathon Suite</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Digitalized Ideathon Judging Suite
              </h1>
              
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                Welcome to the official event management and live evaluation portal. Select your authorized role or choose a demo persona below to enter your workspace.
              </p>
            </div>

            {/* Quick Live Telemetry Info Card */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-lg">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Event Telemetry</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Judging Round
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <div className="text-[10px] text-slate-500 font-mono uppercase">Problem Tracks</div>
                  <div className="text-lg font-bold text-white mt-0.5">{missions.length} Tracks</div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <div className="text-[10px] text-slate-500 font-mono uppercase">Registered Teams</div>
                  <div className="text-lg font-bold text-indigo-400 mt-0.5">{teams.length} Teams</div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <div className="text-[10px] text-slate-500 font-mono uppercase">Panel Judges</div>
                  <div className="text-lg font-bold text-emerald-400 mt-0.5">{judges.length} Active</div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <div className="text-[10px] text-slate-500 font-mono uppercase">Rubric Scale</div>
                  <div className="text-lg font-bold text-amber-400 mt-0.5">100 Max Pts</div>
                </div>
              </div>
            </div>

            {/* Public Links */}
            <div className="flex items-center gap-3 text-xs">
              <Link
                href="/teams"
                className="text-slate-400 hover:text-white underline underline-offset-4 transition-colors"
              >
                Browse All Teams Directory →
              </Link>
              <span className="text-slate-600">&bull;</span>
              <Link
                href="/leaderboard"
                className="text-slate-400 hover:text-white underline underline-offset-4 transition-colors"
              >
                Live Leaderboard →
              </Link>
            </div>
          </div>

          {/* Right Auth Box (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Select Your Role
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Choose a role to instant-launch or enter your access identifier.
              </p>
            </div>

            {/* 4 Role Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {roleConfigs.map((config) => {
                const IconComponent = config.icon;
                const isSelected = selectedRole === config.id;

                return (
                  <div
                    key={config.id}
                    onClick={() => handleRoleSelect(config.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-2 rounded-xl ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          isSelected ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {config.badge}
                        </span>
                      </div>

                      <h3 className="font-bold text-white text-sm">{config.title}</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">{config.subtitle}</p>
                      <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">{config.desc}</p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400">ID: {config.defaultId}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickLogin(config.id, config.defaultId, config.target);
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <span>Launch</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Identifier Form */}
            <form onSubmit={handleSubmit} className="pt-4 border-t border-slate-800 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                    {selectedRole === 'admin' ? 'Admin Access Key' :
                     selectedRole === 'judge' ? 'Judge Code (e.g. JDG-01)' :
                     selectedRole === 'coordinator' ? 'Coordinator Code (e.g. CRD-01)' :
                     'Team Code (e.g. IDEA-01)'}
                  </label>
                  <input
                    type="text"
                    value={customIdentifier}
                    onChange={(e) => setCustomIdentifier(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                    Passcode / PIN (Optional for Demo)
                  </label>
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>{isLoading ? 'Verifying Session...' : `Enter ${selectedRole.toUpperCase()} Portal →`}</span>
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
