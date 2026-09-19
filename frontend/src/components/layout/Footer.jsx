'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Cpu, Terminal, Github, ExternalLink } from 'lucide-react';
import { useDataStore } from '@/lib/dataStore';

export default function Footer() {
  const { resetToDefaultData } = useDataStore();

  return (
    <footer className="border-t border-zinc-900 bg-black text-zinc-400 font-mono text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[var(--primary)] text-black flex items-center justify-center font-heading font-black">
                VV
              </div>
              <span className="font-heading font-black text-white text-base tracking-wider">
                VICEVERSE
              </span>
            </div>
            <p className="text-zinc-500 text-xs leading-relaxed">
              The premier innovation heist platform. Engineered for multi-agent systems, cyber defense, edge telemetry, and high-velocity judging.
            </p>
            <div className="flex items-center gap-2 text-zinc-500">
              <span className="inline-block w-2 h-2 rounded-full bg-[var(--lime)]" />
              <span>SYNDICATE NETWORK OPERATIONAL</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <div className="text-white font-bold tracking-widest text-[11px] uppercase border-b border-zinc-800 pb-1">
              MISSION TRACKS
            </div>
            <ul className="space-y-1.5 text-zinc-500 text-[11px]">
              <li><Link href="/missions" className="hover:text-[var(--primary)]">Agentic AI & Neural Systems</Link></li>
              <li><Link href="/missions" className="hover:text-[var(--primary)]">Cyber Security & Zero-Trust</Link></li>
              <li><Link href="/missions" className="hover:text-[var(--primary)]">Computer Vision Intelligence</Link></li>
              <li><Link href="/missions" className="hover:text-[var(--primary)]">Robotics & Autonomous Swarms</Link></li>
              <li><Link href="/missions" className="hover:text-[var(--primary)]">Embedded Edge & TinyML</Link></li>
              <li><Link href="/missions" className="hover:text-[var(--primary)]">VLSI Silicon Architecture</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <div className="text-white font-bold tracking-widest text-[11px] uppercase border-b border-zinc-800 pb-1">
              OPERATIVE PORTALS
            </div>
            <ul className="space-y-1.5 text-zinc-500 text-[11px]">
              <li><Link href="/team/dashboard" className="hover:text-yellow-400">Team Operative Portal</Link></li>
              <li><Link href="/judge/dashboard" className="hover:text-cyan-400">Syndicate Judge Terminal</Link></li>
              <li><Link href="/admin/dashboard" className="hover:text-red-400">Admin Command Center</Link></li>
              <li><Link href="/leaderboard" className="hover:text-white">Live Scoring Telemetry</Link></li>
              <li><Link href="/login" className="hover:text-white">Terminal Identity Switch</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <div className="text-white font-bold tracking-widest text-[11px] uppercase border-b border-zinc-800 pb-1">
              SYSTEM CONTROLS
            </div>
            <p className="text-zinc-500 text-[11px]">
              Interactive sandbox data engine enabled. Reset database to default seed anytime:
            </p>
            <button
              onClick={resetToDefaultData}
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] tracking-wider uppercase font-bold flex items-center gap-1.5 transition-colors"
            >
              <Terminal className="w-3 h-3 text-[var(--primary)]" />
              RESTORE FACTORY STATE
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-600">
          <div>
            © 2026 VICEVERSE SYNDICATE. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-zinc-500">PROTOCOL: HEIST-v2.6</span>
            <span>·</span>
            <span className="text-zinc-500">RLS: ENFORCED</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
