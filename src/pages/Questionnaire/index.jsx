import React from 'react';
import { useNavigate } from 'react-router-dom';

const Questionnaire = () => {
  const navigate = useNavigate();

  return (
    <div className="px-5 pt-5 flex flex-col gap-5">
      <section className="rounded-[28px] bg-surface-container-lowest border border-outline-variant p-6 shadow-sm">
        <span className="material-symbols-outlined text-primary text-[42px]">dynamic_form</span>
        <h1 className="text-[30px] leading-9 font-['Montserrat'] font-bold text-primary mt-4">Questionnaire moved into Build Route.</h1>
        <p className="text-on-surface-variant mt-3 leading-6">The route builder now asks the key questions in a faster mobile flow.</p>
      </section>
      <button type="button" onClick={() => navigate('/build')} className="bg-primary text-on-primary rounded-2xl py-4 font-['IBM_Plex_Mono'] text-[14px] font-bold active:scale-[0.98] transition-transform">Open builder</button>
    </div>
  );
};

export default Questionnaire;
