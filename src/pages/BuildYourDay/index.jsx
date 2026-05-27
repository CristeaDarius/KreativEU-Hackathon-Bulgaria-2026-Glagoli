import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPlaces } from '../../lib/api';
import { savePlan } from '../../lib/appState';

const cityOptions = ['Svishtov', 'Sofia', 'Plovdiv', 'Varna', 'Burgas', 'Ruse', 'Veliko Tarnovo'];

const questionBank = [
  { key: 'transport', prompt: 'How are you moving today?', type: 'single', options: ['Walking', 'Bike', 'Public transport', 'Car'] },
  { key: 'mood', prompt: 'What are you in the mood for?', type: 'multi', options: ['Food', 'Nature', 'Architecture', 'Meeting new people'] },
  { key: 'foodStyle', prompt: 'Which food moments sound good?', type: 'multi', dependsOn: 'Food', options: ['Local classics', 'Riverside cafe', 'Something sweet', 'Market snacks'] },
  { key: 'natureStyle', prompt: 'Which nature moments sound good?', type: 'multi', dependsOn: 'Nature', options: ['River views', 'Quiet park', 'Photo spots', 'Fresh air walk'] },
  { key: 'architectureStyle', prompt: 'Which architecture angles interest you?', type: 'multi', dependsOn: 'Architecture', options: ['Religious', 'Academic', 'Roman', 'Old town'] },
  { key: 'socialStyle', prompt: 'Who would you like to meet?', type: 'multi', dependsOn: 'Meeting new people', options: ['Students', 'Local guides', 'Artists', 'Families'] },
  { key: 'pace', prompt: 'What pace feels right?', type: 'single', options: ['Very relaxed', 'Balanced', 'Packed route', 'Accessible pace'] },
  { key: 'ending', prompt: 'Where should the route end?', type: 'multi', options: ['Near food', 'By the river', 'At a landmark', 'Surprise me'] },
];

const getQuestions = (answers) => {
  const moods = answers.mood || [];
  return questionBank.filter(question => !question.dependsOn || moods.includes(question.dependsOn));
};

const getAnswerCount = (answer) => Array.isArray(answer) ? answer.length : answer ? 1 : 0;

const BuildYourDay = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({ hours: 4, city: 'Svishtov' });
  const [step, setStep] = useState(0);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlaces().then(setPlaces).catch(() => setPlaces([]));
  }, []);

  const questions = getQuestions(answers);
  const isBasicsStep = step === 0;
  const question = questions[step - 1];
  const totalSteps = questions.length + 1;
  const progress = Math.round(((step + 1) / totalSteps) * 100);

  const updateSingle = (key, value) => {
    setAnswers(current => ({ ...current, [key]: value }));
  };

  const toggleMulti = (key, value) => {
    setAnswers(current => {
      const selected = current[key] || [];
      const next = selected.includes(value)
        ? selected.filter(item => item !== value)
        : [...selected, value];
      return { ...current, [key]: next };
    });
  };

  const canContinue = isBasicsStep || getAnswerCount(answers[question?.key]) > 0;

  const createPlan = () => {
    setLoading(true);
    const hours = Number(answers.hours) || 4;
    const stopCount = hours <= 4 ? 3 : hours <= 8 ? 5 : 7;
    const selectedPlaces = places.slice(0, stopCount);
    const moods = answers.mood?.length ? answers.mood : ['AI-built'];

    savePlan({
      createdAt: new Date().toISOString(),
      city: answers.city,
      hours,
      time: `${hours}h`,
      transport: answers.transport,
      mood: moods.join(' + '),
      answers,
      placeIds: selectedPlaces.map(place => place.id),
    });

    setTimeout(() => navigate('/route-map'), 600);
  };

  const next = () => {
    if (!canContinue || loading) return;
    if (step >= totalSteps - 1) createPlan();
    else setStep(current => current + 1);
  };

  return (
    <div className="px-5 pt-5 pb-8 flex flex-col gap-6 min-h-full">
      <section className="rounded-[28px] bg-primary text-on-primary p-6 shadow-sm">
        <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-primary-fixed-dim">AI route builder</span>
        <h1 className="text-[31px] leading-9 font-['Stack_Sans_Headline'] font-bold mt-2">Let’s shape today.</h1>
        <p className="text-primary-fixed-dim mt-3 leading-6">Choose your constraints, then Locaia adapts the next questions from your mood.</p>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex justify-between items-center font-['IBM_Plex_Mono'] text-[12px] text-on-surface-variant">
          <span>Step {step + 1} of {totalSteps}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
          <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </section>

      {loading ? (
        <section className="rounded-[28px] bg-surface-container-lowest border border-outline-variant p-6 text-center flex flex-col items-center gap-4">
          <div className="w-9 h-9 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant leading-6">Choosing a city, places, list, and map route...</p>
        </section>
      ) : (
        <section className="rounded-[28px] bg-surface-container-lowest border border-outline-variant p-5 flex flex-col gap-5 shadow-sm">
          {isBasicsStep ? (
            <>
              <div>
                <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-outline">Pre-defined question</span>
                <h2 className="text-[28px] leading-8 font-['Stack_Sans_Headline'] font-bold text-primary mt-2">How long and where?</h2>
              </div>

              <div className="app-control p-4 flex flex-col gap-4">
                <div className="flex items-end justify-between">
                  <span className="font-['Stack_Sans_Headline'] text-[22px] font-bold text-primary">{answers.hours} hours</span>
                  <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-outline">3-16h</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="16"
                  value={answers.hours}
                  onChange={event => updateSingle('hours', Number(event.target.value))}
                  className="app-range"
                  style={{ '--range-progress': `${((answers.hours - 3) / 13) * 100}%` }}
                />
                <div className="flex justify-between font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-outline">
                  <span>3h</span>
                  <span>16h</span>
                </div>
              </div>

              <label className="app-control app-select-shell p-4 flex flex-col gap-2">
                <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-outline">Preferred city</span>
                <select
                  value={answers.city}
                  onChange={event => updateSingle('city', event.target.value)}
                  className="app-select font-['Stack_Sans_Headline'] text-[22px] font-bold outline-none"
                >
                  {cityOptions.map(city => (
                    <option key={city} value={city} disabled={city !== 'Svishtov'}>
                      {city === 'Svishtov' ? city : `${city} (coming soon)`}
                    </option>
                  ))}
                </select>
              </label>
            </>
          ) : (
            <>
              <div>
                <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-outline">
                  {question.dependsOn ? 'Generated from your mood' : question.type === 'multi' ? 'Multiple answers allowed' : 'Pre-defined question'}
                </span>
                <h2 className="text-[28px] leading-8 font-['Stack_Sans_Headline'] font-bold text-primary mt-2">{question.prompt}</h2>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {question.options.map(option => {
                  const selected = question.type === 'multi'
                    ? (answers[question.key] || []).includes(option)
                    : answers[question.key] === option;
                  return (
                    <button
                      type="button"
                      key={option}
                      onClick={() => question.type === 'multi' ? toggleMulti(question.key, option) : updateSingle(question.key, option)}
                      className={`w-full rounded-2xl border p-4 text-left flex items-center justify-between shadow-sm active:scale-[0.98] transition-all ${selected ? 'bg-primary text-on-primary border-primary shadow-[0_8px_24px_rgba(16,64,64,0.16)]' : 'bg-surface-container-lowest text-on-surface border-outline-variant'}`}
                    >
                      <span className="text-[17px] font-['Manrope'] font-semibold">{option}</span>
                      <span className="material-symbols-outlined">{selected ? 'check_circle' : question.type === 'multi' ? 'add_circle' : 'radio_button_unchecked'}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </section>
      )}

      {!loading && (
        <section className="sticky bottom-0 -mx-5 px-5 pt-4 pb-5 bg-background/95 backdrop-blur border-t border-outline-variant flex gap-3">
          {step > 0 && (
            <button type="button" onClick={() => setStep(step - 1)} className="basis-1/3 bg-surface border border-outline-variant text-on-surface rounded-2xl py-4 font-['IBM_Plex_Mono'] text-[13px] font-bold active:scale-[0.98] transition-transform">Back</button>
          )}
          <button
            type="button"
            onClick={next}
            disabled={!canContinue}
            className="flex-1 bg-primary text-on-primary rounded-2xl py-4 font-['IBM_Plex_Mono'] text-[14px] font-bold active:scale-[0.98] transition-transform disabled:opacity-45"
          >
            {step >= totalSteps - 1 ? 'Generate route' : 'Next'}
          </button>
        </section>
      )}
    </div>
  );
};

export default BuildYourDay;
