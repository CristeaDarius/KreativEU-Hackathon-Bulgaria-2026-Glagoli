import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="h-dvh w-full bg-surface flex flex-col">
      <div className="flex-1 bg-primary flex flex-col items-center justify-center gap-3 px-6 pt-16 pb-10">
        <span className="material-symbols-outlined text-primary-fixed text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
        <h1 className="text-[32px] font-['Montserrat'] font-bold text-on-primary tracking-tight">{t('app.name')}</h1>
        <p className="text-primary-fixed-dim font-['Manrope'] text-center text-[16px] max-w-xs">{t('login.tagline')}</p>
      </div>
      <div className="px-6 py-8 flex flex-col gap-3 bg-surface">
        <button onClick={() => navigate('/build')} className="w-full bg-primary text-on-primary py-4 rounded-xl font-['IBM_Plex_Mono'] text-[14px] tracking-wide font-medium shadow-sm active:scale-95 transition-transform">
          {t('login.start')}
        </button>
        <button onClick={() => navigate('/build')} className="w-full bg-surface border border-outline-variant text-on-surface py-4 rounded-xl font-['IBM_Plex_Mono'] text-[14px] tracking-wide font-medium active:scale-95 transition-transform">
          {t('login.guest')}
        </button>
        <p className="text-center text-[12px] font-['Manrope'] text-on-surface-variant mt-2">{t('login.terms')}</p>
      </div>
    </div>
  );
};

export default Login;
