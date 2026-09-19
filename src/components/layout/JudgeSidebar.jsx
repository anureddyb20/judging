'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  CheckSquare, 
  History, 
  Sliders, 
  Shield, 
  Award, 
  HelpCircle,
  Clock,
  Layers
} from 'lucide-react';
import { useDataStore } from '@/lib/dataStore';

export default function JudgeSidebar() {
  const pathname = usePathname();
  const { currentUser, assignments, evaluations, teams } = useDataStore();

  const currentJudgeId = currentUser?.id === 'p_judge1' ? 'j1' : currentUser?.id === 'p_judge2' ? 'j2' : 'j3';
  const myAssignments = assignments.filter(a => a.judge_id === currentJudgeId);
  const pendingCount = myAssignments.filter(a => a.status === 'pending').length;
  const completedCount = myAssignments.filter(a => a.status === 'completed').length;

  const links = [
    { name: 'OPERATIVE MATRIX', href: '/judge/dashboard', icon: CheckSquare, badge: pendingCount > 0 ? `${pendingCount} PENDING` : 'DONE' },
    { name: 'EVALUATION ARCHIVE', href: '/judge/history', icon: History, count: completedCount },
    { name: 'HEIST RUBRICS', href: '/missions', icon: Layers },
    { name: 'LIVE LEADERBOARD', href: '/leaderboard', icon: Award }
  ];

  return (
    <aside className="w-full md:w-64 bg-zinc-950/90 border-r border-[var(--border-cyan)] p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* Judge Profile Card */}
        <div className="bracket-corners rockstar-card p-4 border border-[var(--border-cyan)] bg-cyan-950/20">
          <div className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase font-bold mb-1">
            SYNDICATE JUDGE HUD
          </div>
          <div className="text-white font-heading font-black text-sm truncate">
            {currentUser?.full_name || 'JUDGE CIPHER'}
          </div>
          <div className="text-[11px] font-mono text-zinc-400 mt-1">
            CODE: <span className="text-cyan-300 font-bold">JDG-01</span>
          </div>
          
          <div className="mt-3 pt-3 border-t border-cyan-900/40 grid grid-cols-2 gap-2 text-center">
            <div className="bg-black/50 p-1.5 border border-cyan-900/40">
              <div className="text-base font-mono font-black text-cyan-400">{pendingCount}</div>
              <div className="text-[9px] font-mono text-zinc-500 uppercase">PENDING</div>
            </div>
            <div className="bg-black/50 p-1.5 border border-cyan-900/40">
              <div className="text-base font-mono font-black text-emerald-400">{completedCount}</div>
              <div className="text-[9px] font-mono text-zinc-500 uppercase">SCORED</div>
            </div>
          </div>
        </div>

        {/* Links */}
        <nav className="space-y-1 font-mono text-xs">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded transition-all ${
                  isActive
                    ? 'bg-cyan-950/60 text-cyan-300 border-l-4 border-cyan-400 font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span className="text-[9px] font-black px-1.5 py-0.5 bg-cyan-900/50 text-cyan-300 border border-cyan-700">
                    {link.badge}
                  </span>
                )}
                {link.count !== undefined && (
                  <span className="text-[10px] text-zinc-500">
                    ({link.count})
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-zinc-900 font-mono text-[10px] text-zinc-600">
        <div>JUDGING ENCLAVE v2.4</div>
        <div>ALL SCORES ENCRYPTED</div>
      </div>
    </aside>
  );
}
