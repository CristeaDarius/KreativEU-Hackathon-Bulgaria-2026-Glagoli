import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProfile, setLoggedIn } from '../../lib/appState';

const setupQuestions = [
  { key: 'age', label: 'Age group', options: ['Under 18', '18-25', '26-40', '41-65', '65+'] },
  { key: 'gender', label: 'Gender', options: ['Woman', 'Man', 'Non-binary', 'Prefer not to say'] },
  { key: 'accessibility', label: 'Accessibility needs', options: ['None', 'Visual support', 'Step-free route', 'Slow pace'] },
];

const Questionnaire = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});

  const finish = () => {
    saveProfile(answers);
    setLoggedIn();
    navigate('/today', { replace: true });
  };

  return (
    <div className="min-h-dvh px-5 pt-5 pb-28 flex flex-col gap-5">
      <section className="rounded-[28px] bg-primary text-on-primary p-6 shadow-sm">
        <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-primary-fixed-dim">Optional setup</span>
        <h1 className="text-[31px] leading-9 font-['Stack_Sans_Headline'] font-bold mt-2">Help Locaia adapt to you.</h1>
        <p className="text-primary-fixed-dim mt-3 leading-6">These predefined answers personalize route pace and accessibility. You can skip them.</p>
      </section>

      {setupQuestions.map(question => (
        <section key={question.key} className="rounded-[24px] bg-surface-container-lowest border border-outline-variant p-4 flex flex-col gap-3">
          <h2 className="text-[20px] font-['Stack_Sans_Headline'] font-semibold text-primary">{question.label}</h2>
          <div className="grid grid-cols-2 gap-2">
            {question.options.map(option => {
              const active = answers[question.key] === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setAnswers(current => ({ ...current, [question.key]: option }))}
                  className={`rounded-2xl border px-3 py-3 text-[13px] font-['IBM_Plex_Mono'] active:scale-[0.98] transition-all ${active ? 'bg-primary text-on-primary border-primary' : 'bg-surface text-on-surface border-outline-variant'}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </section>
      ))}

      <section className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 pt-4 pb-5 bg-background/95 backdrop-blur border-t border-outline-variant grid grid-cols-2 gap-3">
        <button type="button" onClick={finish} className="bg-surface border border-outline-variant text-on-surface rounded-2xl py-4 font-['IBM_Plex_Mono'] text-[13px] font-bold active:scale-[0.98] transition-transform">Skip</button>
        <button type="button" onClick={finish} className="bg-primary text-on-primary rounded-2xl py-4 font-['IBM_Plex_Mono'] text-[13px] font-bold active:scale-[0.98] transition-transform">Continue</button>
      </section>
    </div>
  );
};

export default Questionnaire;
