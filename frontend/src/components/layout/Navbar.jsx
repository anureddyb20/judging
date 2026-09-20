'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDataStore } from '@/lib/dataStore';
import { 
  Award, 
  Terminal, 
  Trophy, 
  User, 
  LogOut, 
  LayoutDashboard,
  Calendar,
  Layers,
  Sparkles,
  ClipboardList
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { currentUser, logout, eventSettings } = useDataStore();

  const getPortalLink = () => {
    if (!currentUser) return '/login';
    if (currentUser.role === 'admin') return '/admin/dashboard';
    if (currentUser.role === 'coordinator') return '/coordinator/dashboard';
    if (currentUser.role === 'judge') return '/judge/dashboard';
    if (currentUser.role === 'team') return '/team/dashboard';
    return '/login';
  };

  const navLinks = [
    { name: 'Launchpad', href: '/' },
    { name: 'All Teams', href: '/teams' },
    { name: 'Live Leaderboard', href: '/leaderboard' },
    { name: 'Problem Tracks', href: '/missions' },
    { name: 'Guidelines & Rubrics', href: '/rules' },
    { name: 'Timeline', href: '/schedule' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md group-hover:bg-indigo-500 transition-colors">
            IJ
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-base text-white tracking-tight">
                IDEA<span className="text-indigo-400">JUDGE</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">
                CLUB EDITION
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              DIGITALIZED IDEATHON PLATFORM
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 font-sans text-xs font-semibold">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3.5 py-2 transition-all rounded-md ${
                  isActive 
                    ? 'text-white bg-indigo-600/20 border border-indigo-500/30' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* User Session & Role Controls */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link
                href={getPortalLink()}
                className="btn-primary text-xs py-2 px-3.5 flex items-center gap-2"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>
                  {currentUser.role === 'coordinator' 
                    ? 'COORDINATOR HUB' 
                    : `${currentUser.role.toUpperCase()} PORTAL`}
                </span>
              </Link>
              <button
                onClick={logout}
                title="Switch User / Logout"
                className="p-2 border border-white/10 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 bg-slate-900 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>LOG IN / SELECT ROLE</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
