import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../../lib/appState';
import { useTranslation } from 'react-i18next';

const Splash = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/login', { replace: true }), 1600);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-dvh w-full bg-background flex flex-col items-center justify-center gap-5 px-10">
      <img src="/logoicon.svg" alt="Locaia" className="w-28 h-28 object-contain" />
      <img src="/logowithtext.svg" alt="Locaia" className="w-56 max-w-full object-contain" />
      <p className="text-primary font-['IBM_Plex_Mono'] text-[12px] tracking-widest uppercase">{t('splash.subtitle')}</p>
      <div className="mt-7 w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default Splash;
