import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const visitorOptions = [
  { value: 'cultural', label: 'Cultural tourist', icon: 'museum' },
  { value: 'family', label: 'Family', icon: 'family_restroom' },
  { value: 'impaired', label: 'Visually impaired visitor', icon: 'blind' },
];

const timeOptions = [
  { value: 'quick', label: '90 minutes', icon: 'bolt' },
  { value: 'half', label: 'Half day', icon: 'wb_twilight' },
  { value: 'slow', label: 'Slow walk', icon: 'directions_walk' },
];

const BuildYourDay = () => {
  const navigate = useNavigate();
  const [visitor, setVisitor] = useState('cultural');
  const [time, setTime] = useState('half');

  const visitorLabel = visitorOptions.find(o => o.value === visitor)?.label;
  const timeLabel = timeOptions.find(o => o.value === time)?.label;

  return (
    <div className="px-5 pt-5 flex flex-col gap-7">
        {/* Progress */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="font-['IBM_Plex_Mono'] text-[12px] text-outline uppercase tracking-wider">AI Profile Builder</span>
              <span className="font-['IBM_Plex_Mono'] text-[12px] text-primary font-bold">2 choices</span>
            </div>
            <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-primary rounded-full transition-all duration-500" />
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <h1 className="text-[30px] leading-9 font-['Montserrat'] font-semibold text-on-surface tracking-tight">Build your Svishtov day</h1>
            <p className="text-[16px] font-['Manrope'] text-on-surface-variant leading-relaxed">
              Answer a few questions and CityScan will create a cultural route around your pace, interests, and travel style.
            </p>
          </div>
        </section>

        {/* AI insight box */}
        <section className="bg-surface-container rounded-xl p-5 border-l-[3px] border-primary-fixed flex gap-4 items-start shadow-[0_4px_30px_rgba(0,38,46,0.06)] relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary-fixed opacity-10 rounded-bl-full pointer-events-none" />
          <div className="bg-surface-container-lowest rounded-full p-2 shrink-0 border border-outline-variant/50 shadow-sm relative z-10">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
          </div>
          <p className="text-[16px] font-['Manrope'] text-on-surface relative z-10 pt-1">
            Welcome to Svishtov. I'll build a route around your interests, time, and travel style. First, who are you exploring with?
          </p>
        </section>

        {/* Options */}
        <section className="flex flex-col gap-4">
          <h2 className="text-[24px] font-['Montserrat'] font-semibold text-on-surface">Who are you?</h2>
          <div className="flex flex-col gap-3">
            {visitorOptions.map(opt => {
              const isSelected = visitor === opt.value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setVisitor(opt.value)}
                  className={`w-full rounded-xl p-5 flex items-center justify-between transition-all duration-200 shadow-sm border ${
                    isSelected
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container-lowest text-on-surface border-outline-variant hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container'
                    }`}>
                      <span className="material-symbols-outlined" style={isSelected ? { fontVariationSettings: "'FILL' 1" } : {}}>
                        {opt.icon}
                      </span>
                    </div>
                    <span className="text-[18px] font-['Manrope'] font-medium">{opt.label}</span>
                  </div>
                  <span className={`material-symbols-outlined transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                    check_circle
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-[24px] font-['Montserrat'] font-semibold text-on-surface">How much time?</h2>
          <div className="grid grid-cols-3 gap-3">
            {timeOptions.map(opt => {
              const isSelected = time === opt.value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setTime(opt.value)}
                  className={`rounded-2xl p-3 min-h-[112px] flex flex-col items-center justify-center gap-2 border text-center active:scale-[0.98] transition-all ${isSelected ? 'bg-secondary text-on-secondary border-secondary' : 'bg-surface-container-lowest text-on-surface border-outline-variant'}`}
                >
                  <span className="material-symbols-outlined text-[28px]" style={isSelected ? { fontVariationSettings: "'FILL' 1" } : {}}>{opt.icon}</span>
                  <span className="font-['IBM_Plex_Mono'] text-[11px] font-bold uppercase tracking-wide">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="sticky bottom-[86px] -mx-5 px-5 pt-4 pb-5 bg-background/95 backdrop-blur border-t border-outline-variant flex flex-col gap-4">
          <div className="flex justify-between items-center bg-surface-container rounded-lg p-3 border border-outline-variant/30">
            <div className="flex flex-col">
              <span className="font-['IBM_Plex_Mono'] text-[11px] text-outline uppercase tracking-wide">Current Profile</span>
              <span className="font-['IBM_Plex_Mono'] text-[14px] text-on-surface font-semibold">{visitorLabel} · {timeLabel}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/route-map')}
            className="w-full bg-primary text-on-primary py-4 px-6 rounded-xl flex justify-center items-center gap-2 shadow-sm hover:opacity-95 active:scale-[0.98] transition-all border-b-2 border-primary-container"
          >
            <span className="text-[18px] font-['Manrope'] font-medium">Generate AI route</span>
            <span className="material-symbols-outlined text-[20px]">route</span>
          </button>
        </section>
    </div>
  );
};

export default BuildYourDay;
