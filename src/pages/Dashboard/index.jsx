import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNarration } from '../../context/NarrationContext';
import TTSHighlight from '../../components/TTSHighlight';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setNarrationKeys } = useNarration();

  useEffect(() => { setNarrationKeys(['dashboard.label', 'dashboard.title', 'dashboard.description', 'dashboard.open_map']); }, []);

  return (
    <div className="px-5 pt-5 flex flex-col gap-5">
      <section className="rounded-[28px] bg-primary text-on-primary p-6 shadow-sm">
        <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-primary-fixed-dim"><TTSHighlight ttsKey="dashboard.label">{t('dashboard.label')}</TTSHighlight></span>
        <h1 className="text-[30px] leading-9 font-['Stack_Sans_Headline'] font-bold mt-2"><TTSHighlight ttsKey="dashboard.title">{t('dashboard.title')}</TTSHighlight></h1>
        <p className="text-primary-fixed-dim mt-3 leading-6"><TTSHighlight ttsKey="dashboard.description">{t('dashboard.description')}</TTSHighlight></p>
      </section>
      <section className="grid grid-cols-2 gap-3">
        {[
          { key: 'stops', value: '8', label: <TTSHighlight ttsKey="dashboard.stops">{t('dashboard.stops')}</TTSHighlight> },
          { key: 'badges', value: '3', label: <TTSHighlight ttsKey="dashboard.badges">{t('dashboard.badges')}</TTSHighlight> },
          { key: 'audio', value: '42m', label: <TTSHighlight ttsKey="dashboard.audio">{t('dashboard.audio')}</TTSHighlight> },
          { key: 'route', value: '1', label: <TTSHighlight ttsKey="dashboard.route">{t('dashboard.route')}</TTSHighlight> },
        ].map(stat => (
          <div key={stat.key} className="rounded-2xl bg-surface-container-lowest border border-outline-variant p-4">
            <span className="text-[32px] font-['Stack_Sans_Headline'] font-bold text-primary leading-none">{stat.value}</span>
            <span className="block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-outline mt-2">{stat.label}</span>
          </div>
        ))}
      </section>
      <button type="button" onClick={() => navigate('/route-map')} className="bg-primary text-on-primary rounded-2xl py-4 font-['IBM_Plex_Mono'] text-[14px] font-bold active:scale-[0.98] transition-transform">
        <TTSHighlight ttsKey="dashboard.open_map">{t('dashboard.open_map')}</TTSHighlight>
      </button>
    </div>
  );
};

export default Dashboard;
