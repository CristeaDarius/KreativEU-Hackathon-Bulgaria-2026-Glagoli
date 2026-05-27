import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="px-5 pt-10 flex flex-col items-center text-center gap-5">
      <div className="w-20 h-20 rounded-[28px] bg-error-container text-on-error-container flex items-center justify-center">
        <span className="material-symbols-outlined text-[42px]">wrong_location</span>
      </div>
      <div>
        <h1 className="text-[30px] leading-9 font-['Stack_Sans_Headline'] font-bold text-primary">Route not found</h1>
        <p className="text-on-surface-variant mt-2 leading-6">This screen is not part of the Locaia mobile journey.</p>
      </div>
      <button type="button" onClick={() => navigate('/today')} className="w-full bg-primary text-on-primary rounded-2xl py-4 font-['IBM_Plex_Mono'] text-[14px] font-bold active:scale-[0.98] transition-transform">Back to Today</button>
    </div>
  );
};

export default NotFound;
