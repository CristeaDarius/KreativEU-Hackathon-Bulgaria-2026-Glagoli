import React from 'react';
import { useNavigate } from 'react-router-dom';
import { setLoggedIn } from '../../lib/appState';

const Login = () => {
  const navigate = useNavigate();

  const login = () => {
    setLoggedIn();
    navigate('/today', { replace: true });
  };

  return (
    <div className="h-dvh w-full bg-surface flex flex-col">
      {/* Hero */}
      <div className="flex-1 bg-background flex flex-col items-center justify-center gap-4 px-6 pt-16 pb-10">
        <img src="/logoicon.svg" alt="Locaia" className="w-28 h-28 object-contain" />
        <h1 className="text-[42px] leading-none font-['Stack_Sans_Headline'] font-bold text-primary">Locaia</h1>
        <p className="text-on-surface-variant font-['Manrope'] text-center text-[16px] max-w-xs">
          Discover Svishtov through stories, routes, and cultural memory.
        </p>
      </div>

      {/* Actions */}
      <div className="px-6 py-8 flex flex-col gap-3 bg-surface">
        <button
          onClick={login}
          className="w-full bg-primary text-on-primary py-4 rounded-xl font-['IBM_Plex_Mono'] text-[14px] tracking-wide font-medium shadow-sm active:scale-95 transition-transform"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/setup')}
          className="w-full bg-surface border border-outline-variant text-on-surface py-4 rounded-xl font-['IBM_Plex_Mono'] text-[14px] tracking-wide font-medium active:scale-95 transition-transform"
        >
          Continue as guest
        </button>
        <p className="text-center text-[12px] font-['Manrope'] text-on-surface-variant mt-2">
          Demo login stores your app state locally on this device.
        </p>
      </div>
    </div>
  );
};

export default Login;
