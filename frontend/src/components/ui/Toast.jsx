'use client';

import React from 'react';
import { useDataStore } from '@/lib/dataStore';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

export default function Toast() {
  const { toastMessage } = useDataStore();

  if (!toastMessage) return null;

  const isSuccess = toastMessage.type === 'success';
  const isWarning = toastMessage.type === 'warning';
  const isError = toastMessage.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-[999] max-w-md animate-bounce-in">
      <div 
        className="bracket-corners flex items-center gap-3 p-4 shadow-2xl backdrop-blur-md"
        style={{
          background: 'rgba(10, 10, 10, 0.95)',
          border: `1px solid ${isSuccess ? '#39ff14' : isWarning ? '#ff5e00' : isError ? '#ef4444' : '#fdbf15'}`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.8), 0 0 15px ${isSuccess ? 'rgba(57, 255, 20, 0.3)' : 'rgba(253, 191, 21, 0.3)'}`
        }}
      >
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#39ff14] shrink-0" />}
        {isWarning && <AlertTriangle className="w-5 h-5 text-[#ff5e00] shrink-0" />}
        {isError && <AlertTriangle className="w-5 h-5 text-[#ef4444] shrink-0" />}
        {!isSuccess && !isWarning && !isError && <Info className="w-5 h-5 text-[#fdbf15] shrink-0" />}
        
        <div className="flex-1 font-mono text-xs tracking-wider uppercase text-white font-semibold">
          {toastMessage.message}
        </div>
      </div>
    </div>
  );
}
