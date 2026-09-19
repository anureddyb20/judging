'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  GitPullRequest, 
  FileText, 
  Award, 
  Sliders, 
  Radio, 
  Calendar, 
  FileLock2, 
  Activity,
  ShieldAlert
} from 'lucide-react';
import { useDataStore } from '@/lib/dataStore';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { teams, judges, assignments, submissions, evaluations } = useDataStore();

  const navGroups = [
    {
      group: 'TELEMETRY',
      links: [
        { name: 'DASHBOARD', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'LIVE SCORE MATRIX', href: '/admin/evaluations', icon: Award, badge: `${evaluations.length}` },
        { name: 'SUBMISSION VAULT', href: '/admin/submissions', icon: FileText, badge: `${submissions.length}` },
      ]
    },
    {
      group: 'OPERATIVE ASSETS',
      links: [
        { name: 'TEAMS ROSTER', href: '/admin/teams', icon: Users, count: teams.length },
        { name: 'JUDGE SYNDICATE', href: '/admin/judges', icon: UserCheck, count: judges.length },
        { name: 'MATRIX ASSIGNMENTS', href: '/admin/assignments', icon: GitPullRequest, count: assignments.length },
      ]
    },
    {
      group: 'HEIST CONTROLS',
      links: [
        { name: 'EVENT SETTINGS', href: '/admin/settings', icon: Sliders },
        { name: 'RUBRICS & CRITERIA', href: '/admin/rubrics', icon: Award },
        { name: 'BROADCAST DISPATCH', href: '/admin/announcements', icon: Radio },
        { name: 'SCHEDULE TIMELINE', href: '/admin/schedule', icon: Calendar },
        { name: 'AUDIT TRAIL', href: '/admin/audit', icon: Activity },
      ]
    }
  ];

  return (
    <aside className="w-full md:w-64 bg-[#080808] border-r border-[var(--border-pink)] p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
      <div className="space-y-6">
        {/* Admin Clearance Badge */}
        <div className="bracket-corners rockstar-card p-3.5 border border-red-500/40 bg-red-950/20">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-[10px] font-mono text-red-400 tracking-widest uppercase font-bold">
              ROOT CLEARANCE
            </span>
          </div>
          <div className="text-white font-heading font-black text-sm">
            COMMAND CENTER
          </div>
          <div className="text-[10px] font-mono text-zinc-500 mt-1">
            HEIST CONTROL TERMINAL
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-5">
          {navGroups.map((group) => (
            <div key={group.group}>
              <div className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase px-2 mb-1.5">
                {group.group}
              </div>
              <nav className="space-y-0.5 font-mono text-xs">
                {group.links.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`flex items-center justify-between px-3 py-2 rounded transition-all ${
                        isActive
                          ? 'bg-red-950/60 text-red-300 border-l-4 border-red-500 font-bold shadow-lg'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-red-400' : 'text-zinc-500'}`} />
                        <span>{link.name}</span>
                      </div>
                      {link.badge && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 bg-red-900/40 text-red-300 border border-red-800">
                          {link.badge}
                        </span>
                      )}
                      {link.count !== undefined && (
                        <span className="text-[10px] text-zinc-600">
                          ({link.count})
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-900 font-mono text-[10px] text-zinc-600">
        <div>VICEVERSE // CORE OS</div>
        <div>SYS CLEARANCE: LEVEL 5</div>
      </div>
    </aside>
  );
}
