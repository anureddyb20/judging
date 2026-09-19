'use client';

import React from 'react';
import Link from 'next/link';
import { RotateCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useDataStore } from '@/lib/dataStore';

export default function Footer() {
  const { resetToDefaultData, eventSettings } = useDataStore();

  return (
    <footer className="border-t border-white/5 bg-slate-950 text-slate-400 font-sans text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs">
              IJ
            </div>
            <div>
              <div className="font-bold text-white text-sm">
                IDEA JUDGE // DIGITALIZED EVENT PLATFORM
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Engineered for college ideathons, hackathons, and technical club symposiums.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <Link href="/admin/dashboard" className="text-slate-400 hover:text-white transition-colors">
              Admin Lead
            </Link>
            <span>·</span>
            <Link href="/judge/dashboard" className="text-slate-400 hover:text-white transition-colors">
              Judge Evaluation
            </Link>
            <span>·</span>
            <Link href="/coordinator/dashboard" className="text-slate-400 hover:text-white transition-colors">
              Club Coordinator
            </Link>
            <span>·</span>
            <Link href="/team/dashboard" className="text-slate-400 hover:text-white transition-colors">
              Team Leader
            </Link>
          </div>

          <button
            onClick={resetToDefaultData}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 text-xs font-medium transition-colors"
            title="Reset to initial seed state"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Ideathon Technical Judging Suite. All Rights Reserved.
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span>STATUS: JUDGING ACTIVE & SYNCHRONIZED</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
