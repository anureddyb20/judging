'use client';

import React from 'react';
import { useDataStore } from '@/lib/dataStore';
import ClearanceDenied from '@/components/ui/ClearanceDenied';
import JudgeSidebar from '@/components/layout/JudgeSidebar';

export default function JudgeLayout({ children }) {
  const { currentUser } = useDataStore();

  const hasAccess = currentUser && (currentUser.role === 'judge' || currentUser.role === 'admin');

  if (!hasAccess) {
    return <ClearanceDenied requiredRole="JUDGE" />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
      <JudgeSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
