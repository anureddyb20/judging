'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  UploadCloud, 
  Target, 
  Users, 
  Bell, 
  BarChart3
} from 'lucide-react';
import { useDataStore } from '@/lib/dataStore';

export default function TeamBottomNav() {
  const pathname = usePathname();
  const { notifications } = useDataStore();
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const navItems = [
    { name: 'HUB', href: '/team/dashboard', icon: Home },
    { name: 'SUBMIT', href: '/team/submission', icon: UploadCloud },
    { name: 'SCORES', href: '/team/score', icon: Target },
    { name: 'CREW', href: '/team/profile', icon: Users },
    { name: 'INTEL', href: '/team/notifications', icon: Bell, badge: unreadCount },
  ];

  return (
    <nav className="team-bottom-bar border-t border-[var(--border-gold)] z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`team-nav-item flex-1 relative ${isActive ? 'active' : ''}`}
          >
            <div className="relative">
              <Icon className="w-5 h-5 mb-0.5" />
              {item.badge > 0 && (
                <span className="absolute -top-1 -right-2 bg-[var(--accent)] text-white text-[9px] font-bold px-1 rounded-full animate-pulse">
                  {item.badge}
                </span>
              )}
            </div>
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
