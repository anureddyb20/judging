'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Terminal, ArrowRight, Lock } from 'lucide-react';
import { useDataStore } from '@/lib/dataStore';

export default function ClearanceDenied({ requiredRole = 'ADMIN' }) {
  const { currentUser, logout } = useDataStore();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 cyber-grid-bg">
      <div className="bracket-corners rockstar-card max-w-lg w-full p-8 border border-red-500/50 bg-black/90 text-center shadow-[0_0_50px_rgba(239,68,68,0.2)]">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-950/50 border-2 border-red-500 flex items-center justify-center text-red-500 animate-pulse">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div className="inline-block tag-pink mb-4">
          <Lock className="w-3.5 h-3.5 inline mr-1" />
          CLEARANCE LEVEL INSUFFICIENT
        </div>

        <h1 className="text-2xl sm:text-3xl font-heading text-red-400 mb-3 tracking-wider">
          ACCESS RESTRICTED // 403
        </h1>

        <p className="font-mono text-sm text-[var(--text-dim)] mb-6 leading-relaxed">
          Your current operative token <code className="text-yellow-400 font-bold">[{currentUser?.role?.toUpperCase() || 'UNAUTHENTICATED'}]</code> does not possess required syndicate clearance for the <span className="text-white font-bold">{requiredRole.toUpperCase()}</span> terminal.
        </p>

        <div className="bg-zinc-950 border border-zinc-800 p-4 font-mono text-xs text-left mb-6 text-zinc-400 space-y-1">
          <div><span className="text-zinc-600">&gt;</span> AUTH_USER: {currentUser?.full_name || 'ANONYMOUS'}</div>
          <div><span className="text-zinc-600">&gt;</span> REQUIRED_CLEARANCE: {requiredRole}</div>
          <div><span className="text-zinc-600">&gt;</span> STATUS: PROTOCOL_INTERCEPTED</div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login" className="rockstar-btn text-xs py-3">
            <Terminal className="w-4 h-4" />
            Switch Terminal Identity
          </Link>
          <Link href="/" className="rockstar-btn rockstar-btn-outline text-xs py-3">
            Return to Mission HQ
          </Link>
        </div>
      </div>
    </div>
  );
}
