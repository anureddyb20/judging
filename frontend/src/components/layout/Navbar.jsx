'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDataStore } from '@/lib/dataStore';
import { 
  Radio, 
  Terminal, 
  Trophy, 
  MapPin, 
  LogOut, 
  LayoutDashboard,
  Sparkles,
  Flame
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
    { name: 'VICE HQ', href: '/' },
    { name: 'MISSIONS', href: '/missions' },
    { name: 'SCHEDULE', href: '/schedule' },
    { name: 'MOST WANTED', href: '/leaderboard' },
    { name: 'RULES', href: '/rules' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#070210]/95 backdrop-blur-xl border-b border-[rgba(255,0,127,0.25)] shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
      {/* Top GTA VI Telemetry HUD */}
      <div className="bg-[#0b031a] border-b border-[#220c45] px-4 py-1.5 text-[10px] sm:text-[11px] font-mono flex items-center justify-between text-[#c4b5fd] overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 text-[#FF007F] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#00F0FF] inline-block animate-ping" />
            <span className="tracking-wider">LEONIDA DISPATCH</span>
          </div>
          <span className="text-[#3b1d75]">|</span>
          <div className="flex items-center gap-1 text-[#00F0FF]">
            <MapPin className="w-3 h-3 text-[#FF007F]" />
            <span className="hidden sm:inline">25.7617° N, 80.1918° W // VICE CITY</span>
          </div>
          <span className="text-[#3b1d75] hidden md:inline">|</span>
          <div className="hidden md:flex items-center gap-1 text-[#FFB800]">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>VICE FM 104.2 LIVE</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="text-[#8e7cae] hidden sm:inline">CLEARANCE:</span>
              <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded ${
                currentUser.role === 'admin' 
                  ? 'bg-red-950/80 text-red-300 border border-red-500/60 shadow-[0_0_10px_rgba(239,68,68,0.4)]' 
                  : currentUser.role === 'judge'
                  ? 'bg-cyan-950/80 text-[#00F0FF] border border-[#00F0FF]/60 shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                  : 'bg-pink-950/80 text-[#FF77BA] border border-[#FF007F]/60 shadow-[0_0_10px_rgba(255,0,127,0.4)]'
              }`}>
                {currentUser.role}
              </span>
              <span className="text-white font-bold hidden sm:inline">{currentUser.full_name}</span>
            </div>
          ) : (
            <Link href="/login" className="text-[#FF77BA] hover:text-white flex items-center gap-1 transition-colors">
              <Terminal className="w-3 h-3 text-[#00F0FF]" />
              <span className="font-bold">AGENT LOGIN</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Vice Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo - GTA VI Style */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-tr from-[#FF007F] via-[#FF8A00] to-[#00F0FF] p-[2px] shadow-[0_0_20px_rgba(255,0,127,0.6)] group-hover:shadow-[0_0_30px_rgba(0,240,255,0.8)] transition-all">
              <div className="w-full h-full bg-[#0d0322] rounded-[6px] flex items-center justify-center font-heading font-black text-xl tracking-tighter text-white">
                <span className="text-vice-gradient">VI</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-xl tracking-wide text-white group-hover:text-glow-pink transition-all">
                VICE<span className="text-[#FF007F]">VERSE</span>
              </span>
              <span className="gta-vi-badge text-[10px]">VI</span>
            </div>
            <span className="text-[9px] font-mono text-[#00F0FF] tracking-widest uppercase font-bold">
              THE INNOVATION HEIST
            </span>
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
                className={`px-3.5 py-2 transition-all duration-200 rounded-md uppercase font-heading tracking-wider ${
                  isActive 
                    ? 'text-white bg-gradient-to-r from-[rgba(255,0,127,0.25)] to-[rgba(0,240,255,0.2)] border-b-2 border-[#FF007F] shadow-[0_0_15px_rgba(255,0,127,0.3)]' 
                    : 'text-[#c4b5fd] hover:text-white hover:bg-[rgba(255,255,255,0.06)]'
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
                className="p-2 border border-[#3b1d75] text-[#c4b5fd] hover:text-red-400 hover:border-red-500/50 bg-[#16082e] transition-colors rounded"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rockstar-btn text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>TERMINAL AUTH</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
