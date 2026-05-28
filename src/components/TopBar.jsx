import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNarration } from '../context/NarrationContext';
import LanguageSelector from './LanguageSelector';

const TopBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { getNarrationKeys, setActiveKey } = useNarration();
  const [playing, setPlaying] = useState(false);
  const audioRef = React.useRef(null);

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

  const handleSpeak = async () => {
    if (playing) {
      audioRef.current?.pause();
      audioRef.current = null;
      setActiveKey(null);
      setPlaying(false);
      return;
    }

    // Collect visible TTSHighlight elements from the DOM
    const elements = document.querySelectorAll('[data-tts-key]');
    const keys = [];
    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      const visible = rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0;
      if (visible) keys.push(el.getAttribute('data-tts-key'));
    }
    // Deduplicate while preserving order
    const uniqueKeys = [...new Set(keys)];
    if (!uniqueKeys.length) return;

    const lang = localStorage.getItem('lang') || 'en';
    setPlaying(true);

    for (const key of uniqueKeys) {
      const filename = key.replace(/\./g, '_');
      const url = `/audio/ui/${lang}/${filename}.mp3`;
      const head = await fetch(url, { method: 'HEAD' }).catch(() => null);
      if (!head || !head.ok) continue;
      setActiveKey(key);
      await new Promise((resolve) => {
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = resolve;
        audio.onerror = resolve;
        audio.play().catch(resolve);
      });
    }

    setActiveKey(null);
    audioRef.current = null;
    setPlaying(false);
  };

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

        <div className="flex items-center gap-2">
          <LanguageSelector />
          <button
            type="button"
            onClick={handleSpeak}
            className={`w-10 h-10 rounded-full border flex items-center justify-center active:scale-95 transition-all ${
              playing
                ? 'bg-primary text-on-primary border-primary'
                : 'bg-surface-container border-outline-variant text-on-surface-variant'
            }`}
            aria-label="Read page aloud"
          >
            <span className="material-symbols-outlined text-[21px]">
              {playing ? 'stop' : 'volume_up'}
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
      </div>
    </header>
  );
};

export default TopBar;
