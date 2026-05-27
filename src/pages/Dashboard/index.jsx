import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="px-5 pt-5 flex flex-col gap-5">
      <section className="rounded-[28px] bg-primary text-on-primary p-6 shadow-sm">
        <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-primary-fixed-dim">{t('dashboard.label')}</span>
        <h1 className="text-[30px] leading-9 font-['Stack_Sans_Headline'] font-bold mt-2">{t('dashboard.title')}</h1>
        <p className="text-primary-fixed-dim mt-3 leading-6">{t('dashboard.description')}</p>
      </section>
      <section className="grid grid-cols-2 gap-3">
        {[
          { value: '8', label: t('dashboard.stops') },
          { value: '3', label: t('dashboard.badges') },
          { value: '42m', label: t('dashboard.audio') },
          { value: '1', label: t('dashboard.route') },
        ].map(stat => (
          <div key={stat.label} className="rounded-2xl bg-surface-container-lowest border border-outline-variant p-4">
            <span className="text-[32px] font-['Stack_Sans_Headline'] font-bold text-primary leading-none">{stat.value}</span>
            <span className="block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-outline mt-2">{stat.label}</span>
          </div>
        ))}
      </section>
      <button type="button" onClick={() => navigate('/route-map')} className="bg-primary text-on-primary rounded-2xl py-4 font-['IBM_Plex_Mono'] text-[14px] font-bold active:scale-[0.98] transition-transform">
        {t('dashboard.open_map')}
      </button>
    </div>
  );
};

export default Dashboard;
