'use client';

import React, { useState } from 'react';
import { useDataStore } from '@/lib/dataStore';
import TerminalHeader from '@/components/layout/TerminalHeader';
import { Activity, Search, Shield, Filter, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminAuditPage() {
  const { auditLogs } = useDataStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter(log => 
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.entity_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <TerminalHeader
        title="SECURITY & SCORING AUDIT LOGS"
        subtitle="Immutable ledger of administrative commands, judge evaluations, setting shifts, and authorization events."
        badgeText="AUDIT TRAIL"
        badgeColor="pink"
      />

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search audit trail by action, email, or entity..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="hud-input pl-9 text-xs font-mono"
        />
      </div>

      <div className="bracket-corners rockstar-card border border-zinc-800 overflow-hidden bg-black/90 font-mono text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 uppercase text-[11px]">
              <tr>
                <th className="p-4">ACTION PROTOCOL</th>
                <th className="p-4">OPERATIVE / EMAIL</th>
                <th className="p-4">ENTITY TARGET</th>
                <th className="p-4">PAYLOAD DETAILS</th>
                <th className="p-4 text-right">TIMESTAMP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="p-4">
                    <span className="px-2 py-0.5 bg-red-950 text-red-300 border border-red-800 text-[10px] font-bold rounded">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-zinc-300 font-bold">
                    {log.user_email}
                  </td>
                  <td className="p-4 text-cyan-400">
                    {log.entity_type} {log.entity_id ? `[${log.entity_id}]` : ''}
                  </td>
                  <td className="p-4 text-zinc-400 max-w-xs truncate">
                    {JSON.stringify(log.details || {})}
                  </td>
                  <td className="p-4 text-right text-zinc-500 text-[11px]">
                    {formatDate(log.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
