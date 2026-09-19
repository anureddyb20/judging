'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDataStore } from '@/lib/dataStore';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Grid,
  Sliders,
  Award,
  FileText,
  Calendar,
  Settings,
  ExternalLink,
  Shield,
  LogOut
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
  const { logout } = useDataStore();

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-white/10 shadow-lg">
      {/* Top Brand & Utility Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between border-b border-white/5">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md group-hover:bg-indigo-500 transition-colors">
              IJ
            </div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-sm text-white tracking-tight">
                IDEA<span className="text-indigo-400">JUDGE</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">
                ADMIN CONTROL
              </span>
            </div>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors font-medium px-2.5 py-1.5 rounded-lg hover:bg-white/5"
          >
            <span>Public Launchpad</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </Link>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={logout}
              title="Click to Logout & Return to Landing Page"
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 hover:bg-rose-500/15 border border-emerald-500/20 hover:border-rose-500/40 text-emerald-400 hover:text-rose-300 transition-all cursor-pointer group"
            >
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:bg-rose-400 animate-pulse" />
                <span>Lead Admin</span>
              </span>
              <LogOut className="w-3.5 h-3.5 text-emerald-400/80 group-hover:text-rose-400 transition-colors ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Feature Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 border border-white/10 shadow-inner min-w-max">
            {ADMIN_NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap select-none outline-none ${
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
        </div>
      </div>
    </header>
  );
}

export default AdminNav;
