import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="h-dvh w-full bg-surface flex flex-col">
      {/* Hero */}
      <div className="flex-1 bg-primary flex flex-col items-center justify-center gap-3 px-6 pt-16 pb-10">
        <span className="material-symbols-outlined text-primary-fixed text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
        <h1 className="text-[32px] font-['Montserrat'] font-bold text-on-primary tracking-tight">CityScan</h1>
        <p className="text-primary-fixed-dim font-['Manrope'] text-center text-[16px] max-w-xs">
          Discover Svishtov through stories, routes, and cultural memory.
        </p>
      </div>

      {/* Actions */}
      <div className="px-6 py-8 flex flex-col gap-3 bg-surface">
        <button
          onClick={() => navigate('/build')}
          className="w-full bg-primary text-on-primary py-4 rounded-xl font-['IBM_Plex_Mono'] text-[14px] tracking-wide font-medium shadow-sm active:scale-95 transition-transform"
        >
          Start exploring
        </button>
        <button
          onClick={() => navigate('/build')}
          className="w-full bg-surface border border-outline-variant text-on-surface py-4 rounded-xl font-['IBM_Plex_Mono'] text-[14px] tracking-wide font-medium active:scale-95 transition-transform"
        >
          Continue as guest
        </button>
        <p className="text-center text-[12px] font-['Manrope'] text-on-surface-variant mt-2">
          By continuing you agree to our terms of use.
        </p>
      </div>
    </div>
  );
};

export default Login;
