import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const BuildYourDay = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selected, setSelected] = useState('cultural');

  const options = [
    { value: 'cultural', label: t('build.cultural_tourist'), icon: 'museum' },
    { value: 'family', label: t('build.family'), icon: 'family_restroom' },
    { value: 'impaired', label: t('build.visually_impaired'), icon: 'blind' },
  ];

  const selectedLabel = options.find(o => o.value === selected)?.label;

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col antialiased">
      <header className="flex justify-between items-center w-full px-5 md:px-10 py-4 bg-surface border-b border-outline-variant sticky top-0 z-50">
        <button className="text-on-surface-variant hover:bg-surface-container-high transition-colors p-2 -ml-2 rounded-full">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h1 className="text-[24px] font-['Montserrat'] font-bold tracking-tight text-primary">{t('app.name')}</h1>
        <div className="h-8 w-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center">
          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">person</span>
        </div>
      </header>

      <main className="flex-grow px-5 pt-6 pb-40 flex flex-col gap-8 max-w-lg mx-auto w-full">
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="font-['IBM_Plex_Mono'] text-[12px] text-outline uppercase tracking-wider">{t('build.label')}</span>
              <span className="font-['IBM_Plex_Mono'] text-[12px] text-primary font-bold">{t('build.step')}</span>
            </div>
            <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="w-1/4 h-full bg-primary rounded-full transition-all duration-500" />
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <h2 className="text-[28px] font-['Montserrat'] font-semibold text-on-surface tracking-tight">{t('build.title')}</h2>
            <p className="text-[16px] font-['Manrope'] text-on-surface-variant leading-relaxed">{t('build.description')}</p>
          </div>
        </section>

        <section className="bg-surface-container rounded-xl p-5 border-l-[3px] border-primary-fixed flex gap-4 items-start shadow-[0_4px_30px_rgba(0,38,46,0.06)] relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary-fixed opacity-10 rounded-bl-full pointer-events-none" />
          <div className="bg-surface-container-lowest rounded-full p-2 shrink-0 border border-outline-variant/50 shadow-sm relative z-10">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
          </div>
          <p className="text-[16px] font-['Manrope'] text-on-surface relative z-10 pt-1">{t('build.ai_message')}</p>
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="text-[24px] font-['Montserrat'] font-semibold text-on-surface mb-2">{t('build.who_are_you')}</h3>
          <div className="flex flex-col gap-3">
            {options.map(opt => {
              const isSelected = selected === opt.value;
              return (
                <button key={opt.value} onClick={() => setSelected(opt.value)}
                  className={`w-full rounded-xl p-5 flex items-center justify-between transition-all duration-200 shadow-sm border ${
                    isSelected ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-lowest text-on-surface border-outline-variant hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container'}`}>
                      <span className="material-symbols-outlined" style={isSelected ? { fontVariationSettings: "'FILL' 1" } : {}}>{opt.icon}</span>
                    </div>
                    <span className="text-[18px] font-['Manrope'] font-medium">{opt.label}</span>
                  </div>
                  <span className={`material-symbols-outlined transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`}>check_circle</span>
                </button>
              );
            })}
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 w-full bg-surface-container-lowest border-t border-outline-variant px-5 pt-4 pb-6 flex flex-col gap-4 z-40">
        <div className="max-w-lg mx-auto w-full flex flex-col gap-4">
          <div className="flex justify-between items-center bg-surface-container rounded-lg p-3 border border-outline-variant/30">
            <div className="flex flex-col">
              <span className="font-['IBM_Plex_Mono'] text-[11px] text-outline uppercase tracking-wide">{t('build.current_profile')}</span>
              <span className="font-['IBM_Plex_Mono'] text-[14px] text-on-surface font-semibold">{selectedLabel}</span>
            </div>
          </div>
          <button onClick={() => navigate('/route-map')}
            className="w-full bg-primary text-on-primary py-4 px-6 rounded-xl flex justify-center items-center gap-2 shadow-sm active:scale-[0.98] transition-all border-b-2 border-primary-container"
          >
            <span className="text-[18px] font-['Manrope'] font-medium">{t('build.generate')}</span>
            <span className="material-symbols-outlined text-[20px]">route</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuildYourDay;
