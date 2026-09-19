'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Grid,
  Sliders,
  Award,
  FileText,
  Calendar,
  Settings
} from 'lucide-react';

const ADMIN_NAV_ITEMS = [
  { name: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Teams', href: '/admin/teams', icon: Users },
  { name: 'Judges', href: '/admin/judges', icon: UserCheck },
  { name: 'Assignments', href: '/admin/assignments', icon: Grid },
  { name: 'Rubrics', href: '/admin/rubrics', icon: Sliders },
  { name: 'Evaluations', href: '/admin/evaluations', icon: Award },
  { name: 'Submissions', href: '/admin/submissions', icon: FileText },
  { name: 'Schedule', href: '/admin/schedule', icon: Calendar },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-white/10 bg-slate-950/80 sticky top-16 z-40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-4">
          {/* Segmented Capsule Track */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 border border-white/10 shadow-inner overflow-x-auto scrollbar-none w-full sm:w-auto">
            {ADMIN_NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap outline-none select-none ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Quick Status Badge */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-white/5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Admin Governance Mode</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminNav;
