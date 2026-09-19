import React from 'react';
import { AdminNav } from '@/components/layout/AdminNav';

export default function AdminLayout({ children }) {
  return (
    <div className="w-full min-h-screen">
      <AdminNav />
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}
