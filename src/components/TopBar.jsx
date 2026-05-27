import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const TopBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const titles = {
    '/explore': t('topbar.today'),
    '/today': t('topbar.today'),
    '/build': t('topbar.build'),
    '/route-map': t('topbar.route_map'),
    '/compendium': t('topbar.collection'),
    '/concierge': t('topbar.ai_guide'),
    '/dashboard': t('topbar.dashboard'),
    '/settings': t('topbar.settings'),
    '/questionnaire': t('topbar.questionnaire'),
    '/setup': t('topbar.setup'),
  };

  const title = pathname.startsWith('/visit/') ? t('topbar.visit') : titles[pathname] || t('topbar.default');

  return (
    <header className="pt-safe shrink-0 bg-surface/95 backdrop-blur border-b border-outline-variant z-40">
      <div className="h-16 px-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/today')}
          className="flex items-center gap-3 min-w-0 active:scale-95 transition-transform"
          aria-label={t('topbar.today')}
        >
          <span className="w-10 h-10 rounded-2xl bg-white border border-outline-variant flex items-center justify-center shadow-sm overflow-hidden">
            <img src="/logoicon.svg" alt="" className="w-8 h-8 object-contain" />
          </span>
          <span className="min-w-0 text-left">
            <span className="block text-[12px] font-['IBM_Plex_Mono'] uppercase tracking-widest text-on-surface-variant leading-none">Locaia</span>
            <span className="block text-[20px] font-['Stack_Sans_Headline'] font-bold text-primary leading-tight truncate">{title}</span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/settings')}
          className="w-10 h-10 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center active:scale-95 transition-transform"
          aria-label={t('settings.title')}
        >
          <span className="material-symbols-outlined text-on-surface-variant text-[21px]">person</span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
