import React from 'react';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const { t } = useTranslation();

  const items = [
    { icon: 'accessible_forward', title: t('settings.accessible_title'), text: t('settings.accessible_desc') },
    { icon: 'volume_up', title: t('settings.audio_title'), text: t('settings.audio_desc') },
    { icon: 'translate', title: t('settings.language_title'), text: t('settings.language_desc') },
  ];

  return (
    <div className="px-5 pt-5 flex flex-col gap-5">
      <section>
        <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-outline">{t('settings.label')}</span>
        <h1 className="text-[30px] leading-9 font-['Stack_Sans_Headline'] font-bold text-primary mt-1">{t('settings.title')}</h1>
        <p className="text-on-surface-variant mt-2 leading-6">{t('settings.description')}</p>
      </section>
      {items.map(item => (
        <article key={item.title} className="rounded-[22px] bg-surface-container-lowest border border-outline-variant p-4 flex gap-4 shadow-sm">
          <span className="w-12 h-12 rounded-2xl bg-secondary-container text-secondary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined">{item.icon}</span>
          </span>
          <span>
            <span className="block text-[18px] font-['Stack_Sans_Headline'] font-semibold text-on-surface">{item.title}</span>
            <span className="block text-[14px] leading-5 text-on-surface-variant mt-1">{item.text}</span>
          </span>
        </article>
      ))}
    </div>
  );
};

export default Settings;
