import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Splash = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/login'), 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-dvh w-full bg-primary flex flex-col items-center justify-center gap-4">
      <span className="material-symbols-outlined text-primary-fixed text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
      <h1 className="text-[40px] font-['Montserrat'] font-bold tracking-tight text-on-primary">{t('app.name')}</h1>
      <p className="text-primary-fixed-dim font-['IBM_Plex_Mono'] text-[12px] tracking-widest uppercase">{t('splash.subtitle')}</p>
      <div className="mt-8 w-8 h-8 border-2 border-primary-fixed border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default Splash;
