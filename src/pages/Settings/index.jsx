import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNarration } from '../../context/NarrationContext';
import TTSHighlight from '../../components/TTSHighlight';

const Settings = () => {
  const { t } = useTranslation();
  const { setNarrationKeys } = useNarration();

  useEffect(() => {
    setNarrationKeys(['settings.label', 'settings.title', 'settings.description', 'settings.accessible_title', 'settings.accessible_desc', 'settings.audio_title', 'settings.audio_desc', 'settings.language_title', 'settings.language_desc']);
  }, []);

  const items = [
    { icon: 'accessible_forward', key: 'accessible', title: <TTSHighlight ttsKey="settings.accessible_title">{t('settings.accessible_title')}</TTSHighlight>, text: <TTSHighlight ttsKey="settings.accessible_desc">{t('settings.accessible_desc')}</TTSHighlight> },
    // { icon: 'volume_up', key: 'audio', title: <TTSHighlight ttsKey="settings.audio_title">{t('settings.audio_title')}</TTSHighlight>, text: <TTSHighlight ttsKey="settings.audio_desc">{t('settings.audio_desc')}</TTSHighlight> },
    // { icon: 'translate', key: 'language', title: <TTSHighlight ttsKey="settings.language_title">{t('settings.language_title')}</TTSHighlight>, text: <TTSHighlight ttsKey="settings.language_desc">{t('settings.language_desc')}</TTSHighlight> },
  ];

  return (
    <div className="px-5 pt-5 flex flex-col gap-5">
      <section>
        <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-outline"><TTSHighlight ttsKey="settings.label">{t('settings.label')}</TTSHighlight></span>
        <h1 className="text-[30px] leading-9 font-['Stack_Sans_Headline'] font-bold text-primary mt-1"><TTSHighlight ttsKey="settings.title">{t('settings.title')}</TTSHighlight></h1>
        <p className="text-on-surface-variant mt-2 leading-6"><TTSHighlight ttsKey="settings.description">{t('settings.description')}</TTSHighlight></p>
      </section>
      {items.map(item => (
        <article key={item.key} className="rounded-[22px] bg-surface-container-lowest border border-outline-variant p-4 flex gap-4 shadow-sm">
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
