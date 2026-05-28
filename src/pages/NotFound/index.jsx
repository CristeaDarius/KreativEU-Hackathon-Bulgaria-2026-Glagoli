import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNarration } from '../../context/NarrationContext';
import TTSHighlight from '../../components/TTSHighlight';

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setNarrationKeys } = useNarration();

  useEffect(() => { setNarrationKeys(['not_found.title', 'not_found.description', 'not_found.back']); }, []);

  return (
    <div className="px-5 pt-10 flex flex-col items-center text-center gap-5">
      <div className="w-20 h-20 rounded-[28px] bg-error-container text-on-error-container flex items-center justify-center">
        <span className="material-symbols-outlined text-[42px]">wrong_location</span>
      </div>
      <div>
        <h1 className="text-[30px] leading-9 font-['Stack_Sans_Headline'] font-bold text-primary"><TTSHighlight ttsKey="not_found.title">{t('not_found.title')}</TTSHighlight></h1>
        <p className="text-on-surface-variant mt-2 leading-6"><TTSHighlight ttsKey="not_found.description">{t('not_found.description')}</TTSHighlight></p>
      </div>
      <button type="button" onClick={() => navigate('/today')} className="w-full bg-primary text-on-primary rounded-2xl py-4 font-['IBM_Plex_Mono'] text-[14px] font-bold active:scale-[0.98] transition-transform">
        <TTSHighlight ttsKey="not_found.back">{t('not_found.back')}</TTSHighlight>
      </button>
    </div>
  );
};

export default NotFound;
