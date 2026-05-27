import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BottomNav from '../../components/BottomNav';

const Compendium = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    fetch('/api/places').then(r => r.json()).then(setPlaces);
  }, []);

  return (
    <div className="min-h-dvh bg-surface flex flex-col pb-24 font-['Manrope'] antialiased">
      {/* TopBar */}
      <header className="hidden md:flex justify-between items-center w-full px-10 py-4 bg-surface border-b border-outline-variant fixed top-0 z-50">
        <div className="flex items-center gap-4">
          <h1 className="text-[24px] font-['Montserrat'] font-bold text-primary">CityScan</h1>
        </div>
        <nav className="flex gap-6">
          {['Explore', 'Routes', 'Compendium', 'Concierge'].map(item => (
            <a key={item} className={`font-['IBM_Plex_Mono'] text-[14px] px-4 py-2 rounded-lg transition-colors ${
              item === 'Compendium' ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'
            }`} href="#">{item}</a>
          ))}
        </nav>
      </header>

      {/* Mobile TopBar */}
      <header className="md:hidden flex justify-between items-center px-5 py-4 bg-surface border-b border-outline-variant">
        <h1 className="text-[24px] font-['Montserrat'] font-bold text-primary">CityScan</h1>
        <div className="w-9 h-9 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center">
          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">person</span>
        </div>
      </header>

      <main className="pt-4 md:pt-32 px-5 md:px-10 max-w-[1140px] mx-auto w-full flex flex-col gap-8">
        {/* Title */}
        <section>
          <h2 className="text-[28px] md:text-[40px] font-['Montserrat'] font-bold text-primary">{t('compendium.title')}</h2>
          <p className="text-[18px] font-['Manrope'] text-on-surface-variant mt-1">{t('compendium.subtitle')}</p>
        </section>

        {/* Summary bento */}
        <section className="bg-surface-container-lowest rounded-[18px] border border-outline-variant p-6 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 bg-cover bg-center mix-blend-multiply"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80')" }} />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h3 className="text-[24px] font-['Montserrat'] font-semibold text-primary mb-1">{t('compendium.route_memory')}</h3>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary-container">school</span>
                <span className="font-['IBM_Plex_Mono'] text-[14px] font-bold text-tertiary-container">{t('compendium.level')}</span>
              </div>
            </div>
            <div className="flex gap-8">
              {[
                { value: `${places.length}`, label: t('compendium.places') },
                { value: '3', label: t('compendium.badges') },
                { value: '42m', label: t('compendium.audio') },
              ].map(stat => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-[40px] font-['Montserrat'] font-bold text-primary leading-none">{stat.value}</span>
                  <span className="font-['IBM_Plex_Mono'] text-[11px] text-outline uppercase tracking-widest mt-1">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cards grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {places.map((p, i) => (
            <article
              key={p.id}
              className="bg-surface-container-lowest rounded-[18px] border border-outline-variant p-5 shadow-sm flex flex-col gap-4 group hover:border-primary-fixed-dim transition-colors duration-300"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="font-['IBM_Plex_Mono'] text-[11px] text-on-surface-variant uppercase tracking-widest mb-2 block">{t('compendium.heritage_site')}</span>
                  <h4 className="text-[20px] font-['Montserrat'] font-semibold text-primary group-hover:text-primary-container transition-colors">
                    {p.name || p.id}
                  </h4>
                </div>
                <div className="stamp-shape bg-tertiary-fixed w-12 h-12 flex items-center justify-center shrink-0 shadow-sm border border-tertiary-container/20">
                  <span className="material-symbols-outlined text-tertiary-container">local_library</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-surface-variant">
                <span className="font-['IBM_Plex_Mono'] text-[11px] text-outline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">schedule</span> {t('compendium.stop', { n: i + 1 })}
                </span>
                <button
                  onClick={() => navigate(`/concierge`)}
                  className="bg-secondary text-on-secondary px-5 py-2 rounded-lg font-['IBM_Plex_Mono'] text-[13px] hover:bg-on-secondary-container transition-colors flex items-center gap-2 active:scale-95"
                >
                  {t('compendium.open_story')} <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </article>
          ))}

          {/* Locked card */}
          <article className="bg-surface-container/50 border-2 border-dashed border-outline-variant rounded-[18px] p-6 flex flex-col items-center justify-center text-center gap-4 min-h-[180px]">
            <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center">
              <span className="material-symbols-outlined text-outline">lock</span>
            </div>
            <div>
              <h4 className="text-[20px] font-['Montserrat'] font-semibold text-on-surface-variant">{t('compendium.discover_more')}</h4>
              <p className="text-[16px] font-['Manrope'] text-outline mt-1">{t('compendium.discover_more_desc')}</p>
            </div>
          </article>
        </section>
      </main>

      <BottomNav active="Compendium" />
    </div>
  );
};

export default Compendium;
