import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setLoggedIn } from '../../lib/appState';
import { useTranslation } from 'react-i18next';
import { useNarration } from '../../context/NarrationContext';
import TTSHighlight from '../../components/TTSHighlight';
import LanguageSelector from '../../components/LanguageSelector';

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setNarrationKeys, getNarrationKeys, setActiveKey } = useNarration();
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    setNarrationKeys(['login.start', 'login.guest', 'login.terms']);
    // setNarrationKeys(['login.tagline', 'login.start', 'login.guest', 'login.terms']);
  }, []);

  const login = () => {
    setLoggedIn();
    navigate('/today', { replace: true });
  };

  const handleSpeak = async () => {
    if (playing) {
      audioRef.current?.pause();
      audioRef.current = null;
      setActiveKey(null);
      setPlaying(false);
      return;
    }
    const keys = getNarrationKeys();
    if (!keys.length) return;
    const lang = localStorage.getItem('lang') || 'en';
    setPlaying(true);
    for (const key of keys) {
      const url = `/audio/ui/${lang}/${key.replace(/\./g, '_')}.mp3`;
      const head = await fetch(url, { method: 'HEAD' }).catch(() => null);
      if (!head || !head.ok) continue;
      setActiveKey(key);
      await new Promise(resolve => {
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
    <div className="h-dvh w-full bg-surface flex flex-col relative">
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <LanguageSelector />
        <button
          onClick={handleSpeak}
          className={`w-10 h-10 rounded-full border flex items-center justify-center active:scale-95 transition-all ${
            playing ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container border-outline-variant text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[21px]">{playing ? 'stop' : 'volume_up'}</span>
        </button>
      </div>
      <div className="flex-1 bg-background flex flex-col items-center justify-center gap-4 px-6 pt-16 pb-10">
        <img src="/logoicon.svg" alt="Locaia" className="w-28 h-28 object-contain" />
        <h1 className="text-[42px] leading-none font-['Stack_Sans_Headline'] font-bold text-primary">Locaia</h1>
        <p className="text-on-surface-variant font-['Manrope'] text-center text-[16px] max-w-xs">
          <TTSHighlight ttsKey="login.tagline">{t('login.tagline')}</TTSHighlight>
        </p>
      </div>
      <div className="px-6 py-8 flex flex-col gap-3 bg-surface">
        <button onClick={login} className="w-full bg-primary text-on-primary py-4 rounded-xl font-['IBM_Plex_Mono'] text-[14px] tracking-wide font-medium shadow-sm active:scale-95 transition-transform">
          <TTSHighlight ttsKey="login.start">{t('login.start')}</TTSHighlight>
        </button>
        <button onClick={() => navigate('/setup')} className="w-full bg-surface border border-outline-variant text-on-surface py-4 rounded-xl font-['IBM_Plex_Mono'] text-[14px] tracking-wide font-medium active:scale-95 transition-transform">
          <TTSHighlight ttsKey="login.guest">{t('login.guest')}</TTSHighlight>
        </button>
        <p className="text-center text-[12px] font-['Manrope'] text-on-surface-variant mt-2">
          <TTSHighlight ttsKey="login.terms">{t('login.terms')}</TTSHighlight>
        </p>
      </div>
    </div>
  );
};

export default Login;
