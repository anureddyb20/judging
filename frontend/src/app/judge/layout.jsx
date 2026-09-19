'use client';

import React from 'react';
import { JudgeNav } from '@/components/layout/JudgeNav';

export default function JudgeLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <JudgeNav />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
