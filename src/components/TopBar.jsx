import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const titles = {
  '/explore': 'Explore',
  '/build': 'Build Route',
  '/route-map': 'Route Map',
  '/compendium': 'Compendium',
  '/concierge': 'AI Guide',
  '/dashboard': 'Dashboard',
  '/settings': 'Settings',
  '/questionnaire': 'Questionnaire',
};

const TopBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const title = titles[pathname] || 'CityScan';

  return (
    <header className="pt-safe shrink-0 bg-surface/95 backdrop-blur border-b border-outline-variant z-40">
      <div className="h-16 px-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/explore')}
          className="flex items-center gap-3 min-w-0 active:scale-95 transition-transform"
          aria-label="Go to Explore"
        >
          <span className="w-10 h-10 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
          </span>
          <span className="min-w-0 text-left">
            <span className="block text-[12px] font-['IBM_Plex_Mono'] uppercase tracking-widest text-on-surface-variant leading-none">CityScan</span>
            <span className="block text-[20px] font-['Montserrat'] font-bold text-primary leading-tight truncate">{title}</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/settings')}
          className="w-10 h-10 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Open settings"
        >
          <span className="material-symbols-outlined text-on-surface-variant text-[21px]">person</span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
