import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const titles = {
  '/explore': 'Today',
  '/today': 'Today',
  '/build': 'Build Route',
  '/route-map': 'Route Map',
  '/compendium': 'Collection',
  '/concierge': 'AI Guide',
  '/dashboard': 'Dashboard',
  '/settings': 'Settings',
  '/questionnaire': 'Questionnaire',
  '/setup': 'Setup',
};

const TopBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const title = pathname.startsWith('/visit/') ? 'Visit Stop' : titles[pathname] || 'Locaia';

  return (
    <header className="pt-safe shrink-0 bg-surface/95 backdrop-blur border-b border-outline-variant z-40">
      <div className="h-16 px-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/today')}
          className="flex items-center gap-3 min-w-0 active:scale-95 transition-transform"
          aria-label="Go to Today"
        >
          <span className="w-10 h-10 rounded-2xl bg-white border border-outline-variant flex items-center justify-center shadow-sm overflow-hidden">
            <img src="/logoicon.svg" alt="" className="w-8 h-8 object-contain" />
          </span>
          <span className="min-w-0 text-left">
            <span className="block text-[12px] font-['IBM_Plex_Mono'] uppercase tracking-widest text-on-surface-variant leading-none">Locaia</span>
            <span className="block text-[20px] font-['Stack_Sans_Headline'] font-bold text-primary leading-tight truncate">{title}</span>
          </span>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/build')}
            className="h-10 px-3 rounded-full bg-primary text-on-primary flex items-center gap-1.5 active:scale-95 transition-transform shadow-sm"
            aria-label="Open AI guide builder"
          >
            <span className="material-symbols-outlined text-[19px]">record_voice_over</span>
            <span className="font-['IBM_Plex_Mono'] text-[10px] font-bold uppercase tracking-wide">Guide</span>
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
      </div>
    </header>
  );
};

export default TopBar;
