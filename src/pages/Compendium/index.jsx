import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNarration } from '../../context/NarrationContext';
import { getPlaceName } from '../../lib/api';
import { getCollection } from '../../lib/appState';
import TTSHighlight from '../../components/TTSHighlight';

const Compendium = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setNarrationKeys } = useNarration();
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    setNarrationKeys(['compendium.title', 'compendium.subtitle', 'compendium.route_memory', 'compendium.level', 'compendium.heritage_site', 'compendium.open_story', 'compendium.empty', 'compendium.discover_more', 'compendium.discover_more_desc']);
    const load = () => setPlaces(getCollection());
    load();
    window.addEventListener('focus', load);
    return () => window.removeEventListener('focus', load);
  }, []);

  return (
    <div className="px-5 pt-5 flex flex-col gap-7 font-['Manrope'] antialiased">
      <section>
        <h1 className="text-[30px] leading-9 font-['Stack_Sans_Headline'] font-bold text-primary"><TTSHighlight ttsKey="compendium.title">{t('compendium.title')}</TTSHighlight></h1>
        <p className="text-[18px] font-['Manrope'] text-on-surface-variant mt-1"><TTSHighlight ttsKey="compendium.subtitle">{t('compendium.subtitle')}</TTSHighlight></p>
      </section>

      <section className="bg-surface-container-lowest rounded-[18px] border border-outline-variant p-6 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 bg-cover bg-center mix-blend-multiply"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80')" }} />
        <div className="relative z-10 flex flex-col justify-between items-start gap-6">
          <div>
            <h3 className="text-[24px] font-['Stack_Sans_Headline'] font-semibold text-primary mb-1"><TTSHighlight ttsKey="compendium.route_memory">{t('compendium.route_memory')}</TTSHighlight></h3>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary-container">school</span>
              <span className="font-['IBM_Plex_Mono'] text-[14px] font-bold text-tertiary-container"><TTSHighlight ttsKey="compendium.level">{t('compendium.level')}</TTSHighlight></span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-5 w-full">
            {[
              { key: 'saved', value: `${places.length}`, label: <TTSHighlight ttsKey="compendium.saved">{t('compendium.saved')}</TTSHighlight> },
              { key: 'badges', value: '3', label: <TTSHighlight ttsKey="compendium.badges">{t('compendium.badges')}</TTSHighlight> },
              { key: 'audio', value: '42m', label: <TTSHighlight ttsKey="compendium.audio">{t('compendium.audio')}</TTSHighlight> },
            ].map(stat => (
              <div key={stat.key} className="flex flex-col">
                <span className="text-[40px] font-['Stack_Sans_Headline'] font-bold text-primary leading-none">{stat.value}</span>
                <span className="font-['IBM_Plex_Mono'] text-[11px] text-outline uppercase tracking-widest mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4">
        {places.length === 0 && (
          <div className="rounded-2xl bg-surface-container p-5 text-on-surface-variant leading-6"><TTSHighlight ttsKey="compendium.empty">{t('compendium.empty')}</TTSHighlight></div>
        )}
        {places.map((p, i) => (
          <article key={p.id} className="bg-surface-container-lowest rounded-[18px] border border-outline-variant p-5 shadow-sm flex flex-col gap-4 group hover:border-primary-fixed-dim transition-colors duration-300">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="font-['IBM_Plex_Mono'] text-[11px] text-on-surface-variant uppercase tracking-widest mb-2 block"><TTSHighlight ttsKey="compendium.heritage_site">{t('compendium.heritage_site')}</TTSHighlight></span>
                <h4 className="text-[20px] font-['Stack_Sans_Headline'] font-semibold text-primary group-hover:text-secondary transition-colors">{getPlaceName(p)}</h4>
              </div>
              <div className="stamp-shape bg-tertiary-fixed w-12 h-12 flex items-center justify-center shrink-0 shadow-sm border border-tertiary-container/20">
                <span className="material-symbols-outlined text-tertiary-container">local_library</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-surface-variant">
              <span className="font-['IBM_Plex_Mono'] text-[11px] text-outline flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">schedule</span> {t('compendium.stop', { n: i + 1 })}
              </span>
              <button type="button" onClick={() => navigate(`/visit/${encodeURIComponent(p.id)}`)}
                className="bg-secondary text-on-secondary px-5 py-2 rounded-lg font-['IBM_Plex_Mono'] text-[13px] hover:bg-on-secondary-container transition-colors flex items-center gap-2 active:scale-95"
              >
                <TTSHighlight ttsKey="compendium.open_story">{t('compendium.open_story')}</TTSHighlight> <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </article>
        ))}

        <article className="bg-surface-container/50 border-2 border-dashed border-outline-variant rounded-[18px] p-6 flex flex-col items-center justify-center text-center gap-4 min-h-[180px]">
          <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-outline">lock</span>
          </div>
          <div>
            <h4 className="text-[20px] font-['Stack_Sans_Headline'] font-semibold text-on-surface-variant"><TTSHighlight ttsKey="compendium.discover_more">{t('compendium.discover_more')}</TTSHighlight></h4>
            <p className="text-[16px] font-['Manrope'] text-outline mt-1"><TTSHighlight ttsKey="compendium.discover_more_desc">{t('compendium.discover_more_desc')}</TTSHighlight></p>
          </div>
        </article>
      </section>
    </div>
  );
};

export default Compendium;
