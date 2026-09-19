'use client';

import React from 'react';
import { useDataStore } from '@/lib/dataStore';
import ClearanceDenied from '@/components/ui/ClearanceDenied';
import AdminSidebar from '@/components/layout/AdminSidebar';

export default function AdminLayout({ children }) {
  const { currentUser } = useDataStore();

  const hasAccess = currentUser && currentUser.role === 'admin';

  if (!hasAccess) {
    return <ClearanceDenied requiredRole="ADMIN / COMMANDER" />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-black/40">
        {children}
      </main>
    </div>
  );
}
