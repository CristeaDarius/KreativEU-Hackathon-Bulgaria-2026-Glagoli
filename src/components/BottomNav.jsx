import React from 'react';
import { NavLink } from 'react-router-dom';

const tabs = [
  { label: 'Explore', icon: 'explore', path: '/explore' },
  { label: 'Routes', icon: 'route', path: '/route-map' },
  { label: 'Compendium', icon: 'auto_stories', path: '/compendium' },
  { label: 'Concierge', icon: 'settings_accessibility', path: '/concierge' },
];

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 px-3 pt-2 pb-safe bg-surface-container/95 backdrop-blur border-t border-outline-variant shadow-[0_-8px_24px_rgba(0,38,46,0.08)]">
      <div className="grid grid-cols-4 gap-1">
        {tabs.map(tab => (
          <NavLink
            key={tab.label}
            to={tab.path}
            className={({ isActive }) => `min-h-[58px] flex flex-col items-center justify-center gap-1 rounded-2xl transition-all duration-150 ${
              isActive ? 'bg-primary text-on-primary shadow-sm scale-[0.98]' : 'text-on-surface-variant active:bg-surface-container-high'
            }`}
          >
            {({ isActive }) => (
              <>
                <span className="material-symbols-outlined text-[23px]" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  {tab.icon}
                </span>
                <span className={`text-[10px] font-['IBM_Plex_Mono'] leading-none ${isActive ? 'font-bold' : ''}`}>{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
