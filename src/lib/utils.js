// ==============================================================================
// VICEVERSE GENERAL UTILITY HELPERS
// ==============================================================================

import clsx from 'clsx';

export function cn(...inputs) {
  return clsx(inputs);
}

export function formatTimeRemaining(targetDate) {
  if (!targetDate) return { hours: '00', minutes: '00', seconds: '00', expired: true };
  
  const target = new Date(targetDate).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (diff <= 0) {
    return { hours: '00', minutes: '00', seconds: '00', expired: true };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
    expired: false
  };
}

export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function getMissionColor(code) {
  const map = {
    'MSN-AI': '#fdbf15',
    'MSN-SEC': '#ff007f',
    'MSN-CV': '#00f0ff',
    'MSN-ROB': '#39ff14',
    'MSN-IOT': '#ff5e00',
    'MSN-VLSI': '#bf00ff'
  };
  return map[code] || '#fdbf15';
}

export function getRankBadgeColor(rank) {
  if (rank === 1) return '#fdbf15'; // Gold
  if (rank === 2) return '#e5e7eb'; // Silver
  if (rank === 3) return '#cd7f32'; // Bronze
  return '#4b5563';
}
