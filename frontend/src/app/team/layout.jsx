'use client';

import React from 'react';
import { useDataStore } from '@/lib/dataStore';
import ClearanceDenied from '@/components/ui/ClearanceDenied';
import TeamBottomNav from '@/components/layout/TeamBottomNav';

export default function TeamLayout({ children }) {
  const { currentUser } = useDataStore();

  // Allow admin and team roles to view the team portal for testing
  const hasAccess = currentUser && (currentUser.role === 'team' || currentUser.role === 'admin');

  if (!hasAccess) {
    return <ClearanceDenied requiredRole="OPERATIVE" />;
  }

  return (
    <div className="min-h-screen pb-24 sm:pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </div>
      <TeamBottomNav />
    </div>
  );
}
