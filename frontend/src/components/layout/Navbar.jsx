'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDataStore } from '@/lib/dataStore';
import { 
  Zap, 
  Terminal, 
  Trophy, 
  ShieldCheck, 
  Calendar, 
  Cpu, 
  LogOut, 
  Radio, 
  ChevronRight,
  User,
  LayoutDashboard
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, logout, eventSettings } = useDataStore();

  const getPortalLink = () => {
    if (!currentUser) return '/login';
    if (currentUser.role === 'admin') return '/admin/dashboard';
    if (currentUser.role === 'judge') return '/judge/dashboard';
    if (currentUser.role === 'team') return '/team/dashboard';
    return '/login';
  };

  const navLinks = [
    { name: 'HQ', href: '/' },
    { name: 'MISSIONS', href: '/missions' },
    { name: 'SCHEDULE', href: '/schedule' },
    { name: 'LEADERBOARD', href: '/leaderboard' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-md border-b border-[var(--border-dim)]">
      {/* Top Telemetry Ticker Bar */}
      <div className="bg-[#0a0a0a] border-b border-zinc-900 px-4 py-1 text-[11px] font-mono flex items-center justify-between text-zinc-400 overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[var(--primary)] font-bold">
            <span className="w-2 h-2 rounded-full bg-[var(--lime)] inline-block animate-pulse" />
            <span>SYS: ONLINE</span>
          </div>
          <span className="text-zinc-700">|</span>
          <span className="hidden sm:inline">PHASE: <span className="text-white font-bold">{eventSettings?.event_phase || 'ACTIVE'}</span></span>
          <span className="text-zinc-700 hidden sm:inline">|</span>
          <span className="hidden md:inline text-zinc-400">ENCRYPTION: AES-256-GCM</span>
        </div>

        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">CLEARANCE:</span>
              <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded ${
                currentUser.role === 'admin' 
                  ? 'bg-red-950 text-red-400 border border-red-800' 
                  : currentUser.role === 'judge'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  : 'bg-yellow-950 text-yellow-300 border border-yellow-800'
              }`}>
                {currentUser.role}
              </span>
              <span className="text-zinc-300 font-bold hidden sm:inline">{currentUser.full_name}</span>
            </div>
          ) : (
            <Link href="/login" className="text-yellow-400 hover:text-white flex items-center gap-1">
              <Terminal className="w-3 h-3" />
              <span>TERMINAL AUTH</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[var(--primary)] text-black flex items-center justify-center font-heading font-black text-xl tracking-tighter group-hover:bg-white transition-colors">
            VV
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-black text-lg tracking-wider text-white flex items-center gap-1">
              VICEVERSE
              <span className="text-[var(--primary)] text-xs font-mono font-bold tracking-widest px-1.5 py-0.5 bg-[var(--primary-subtle)] border border-[var(--border-gold)]">2026</span>
            </span>
            <span className="text-[9px] font-mono text-zinc-400 tracking-widest uppercase">THE INNOVATION HEIST</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 font-mono text-xs font-bold tracking-wider">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3.5 py-2 transition-all duration-150 rounded ${
                  isActive 
                    ? 'text-[var(--primary)] bg-[var(--primary-subtle)] border-b-2 border-[var(--primary)]' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Role Portal Action Buttons */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link
                href={getPortalLink()}
                className="rockstar-btn text-xs py-2 px-4 flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{currentUser.role.toUpperCase()} PORTAL</span>
              </Link>
              <button
                onClick={logout}
                title="Log Out"
                className="p-2 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-900 bg-zinc-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rockstar-btn text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>ACCESS TERMINAL</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
