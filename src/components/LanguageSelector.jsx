import React, { useState } from 'react';
import i18n from '../i18n';

const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ro', label: 'RO', name: 'Română' },
  { code: 'bg', label: 'BG', name: 'Български' },
  { code: 'sk', label: 'SK', name: 'Slovenčina' },
  { code: 'pl', label: 'PL', name: 'Polski' },
  { code: 'cs', label: 'CS', name: 'Čeština' },
];

const LanguageSelector = ({ compact = false }) => {
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  const select = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('lang', code);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-outline-variant bg-surface-container font-['IBM_Plex_Mono'] text-[12px] text-on-surface-variant hover:bg-surface-container-high transition-colors"
      >
        {current.label}
        <span className="material-symbols-outlined text-[14px]">expand_more</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 bg-surface border border-outline-variant rounded-xl shadow-lg overflow-hidden min-w-[140px]">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                type="button"
                onClick={() => select(lang.code)}
                className={`w-full text-left px-4 py-2.5 font-['IBM_Plex_Mono'] text-[13px] flex items-center justify-between transition-colors ${
                  lang.code === current.code
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span>{lang.name}</span>
                <span className="opacity-60 text-[11px]">{lang.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
