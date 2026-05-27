import React from 'react';
import { useNavigate } from 'react-router-dom';

const tabs = [
  { label: 'Explore', icon: 'explore', path: '/' },
  { label: 'Routes', icon: 'route', path: '/route-map' },
  { label: 'Compendium', icon: 'auto_stories', path: '/compendium' },
  { label: 'Concierge', icon: 'settings_accessibility', path: '/concierge' },
];

const BottomNav = ({ active }) => {
  const navigate = useNavigate();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-safe pt-2 bg-surface-container border-t border-outline-variant shadow-sm h-20">
      {tabs.map(tab => {
        const isActive = tab.label === active;
        return (
          <button
            key={tab.label}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-xl transition-all duration-150 ${
              isActive ? 'bg-primary-container text-on-primary-container scale-95' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
              {tab.icon}
            </span>
            <span className={`text-[12px] font-['IBM_Plex_Mono'] mt-1 ${isActive ? 'font-bold' : ''}`}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
