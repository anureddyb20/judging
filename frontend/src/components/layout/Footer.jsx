'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal, MapPin, Radio, Shield, Sparkles } from 'lucide-react';
import { useDataStore } from '@/lib/dataStore';

export default function Footer() {
  const { resetToDefaultData } = useDataStore();

  return (
    <footer className="border-t border-[#301258] bg-[#070210] text-[#c4b5fd] font-mono text-xs mt-24 relative overflow-hidden">
      {/* GTA VI Neon Laser Glow Accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF007F] via-[#FF8A00] to-[#00F0FF] shadow-[0_0_15px_rgba(255,0,127,0.8)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-tr from-[#FF007F] to-[#00F0FF] p-[1.5px] flex items-center justify-center font-heading font-black text-white text-sm">
                <div className="w-full h-full bg-[#0d0322] flex items-center justify-center rounded-[3px]">
                  <span className="text-vice-gradient font-black">VI</span>
                </div>
              </div>
              <span className="font-heading font-black text-white text-lg tracking-wider">
                VICE<span className="text-[#FF007F]">VERSE</span>
              </span>
            </div>
            <p className="text-[#9d8ec2] text-xs leading-relaxed">
              Leonida County's premier high-velocity innovation heist. Multi-agent AI systems, zero-trust cyber defense, edge telemetry, and live syndicate judging.
            </p>
            <div className="flex items-center gap-2 text-[#00F0FF] font-bold text-[10px]">
              <span className="inline-block w-2 h-2 rounded-full bg-[#39FF14] animate-ping" />
              <span>VICE CITY SYNDICATE NETWORK LIVE</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <div className="text-white font-heading font-black tracking-widest text-[12px] uppercase border-b border-[#2d1154] pb-1.5 flex items-center justify-between">
              <span>HEIST MISSIONS</span>
              <span className="text-[#FF007F] text-[10px]">06 TRACKS</span>
            </div>
            <ul className="space-y-2 text-[#9d8ec2] text-[11px]">
              <li><Link href="/missions" className="hover:text-[#00F0FF] transition-colors">Neural Intelligence & Agentic AI</Link></li>
              <li><Link href="/missions" className="hover:text-[#00F0FF] transition-colors">Zero-Trust & Cyber Warfare</Link></li>
              <li><Link href="/missions" className="hover:text-[#00F0FF] transition-colors">Autonomous Swarms & Robotics</Link></li>
              <li><Link href="/missions" className="hover:text-[#00F0FF] transition-colors">Edge Telemetry & TinyML</Link></li>
              <li><Link href="/missions" className="hover:text-[#00F0FF] transition-colors">Silicon VLSI Architecture</Link></li>
              <li><Link href="/missions" className="hover:text-[#00F0FF] transition-colors">Computer Vision & Drone Recon</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <div className="text-white font-heading font-black tracking-widest text-[12px] uppercase border-b border-[#2d1154] pb-1.5 flex items-center justify-between">
              <span>OPERATIVE TERMINALS</span>
              <span className="text-[#00F0FF] text-[10px]">DIRECT</span>
            </div>
            <ul className="space-y-2 text-[#9d8ec2] text-[11px]">
              <li><Link href="/team/dashboard" className="hover:text-[#FF77BA] transition-colors">Operative Dispatch Portal</Link></li>
              <li><Link href="/judge/dashboard" className="hover:text-[#00F0FF] transition-colors">Syndicate Judge Dossier</Link></li>
              <li><Link href="/admin/dashboard" className="hover:text-[#FFB800] transition-colors">Leonida Command Center</Link></li>
              <li><Link href="/leaderboard" className="hover:text-white transition-colors">Most Wanted Scoreboard</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Terminal Switch</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <div className="text-white font-heading font-black tracking-widest text-[12px] uppercase border-b border-[#2d1154] pb-1.5 flex items-center justify-between">
              <span>SYSTEM PROTOCOLS</span>
              <span className="text-[#39FF14] text-[10px]">ACTIVE</span>
            </div>
            <p className="text-[#9d8ec2] text-[11px] leading-relaxed">
              Full telemetry synchronization active. Reset local evaluation testbench to initial seed state anytime:
            </p>
            <button
              onClick={resetToDefaultData}
              className="px-3.5 py-2 bg-[#16082e] hover:bg-[#250d4d] border border-[#FF007F]/40 text-[#FF77BA] text-[10px] tracking-wider uppercase font-bold flex items-center gap-2 transition-all rounded shadow-[0_0_10px_rgba(255,0,127,0.2)] hover:shadow-[0_0_15px_rgba(255,0,127,0.5)]"
            >
              <Terminal className="w-3.5 h-3.5 text-[#00F0FF]" />
              RESTORE FACTORY SEED
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-[#220c45] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#7a6a98]">
          <div className="flex items-center gap-2">
            <span className="text-[#FF007F] font-bold">VICE CITY // LEONIDA STATE</span>
            <span>·</span>
            <span>© 2026 VICEVERSE PLATFORM</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#c4b5fd]">PROTOCOL: VI-HEIST</span>
            <span>·</span>
            <span className="text-[#00F0FF]">5-STAR SECURITY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
