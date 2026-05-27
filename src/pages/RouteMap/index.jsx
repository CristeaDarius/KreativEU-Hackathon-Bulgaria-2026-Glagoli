import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';

const RouteMap = () => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    fetch('/api/places').then(r => r.json()).then(data => setPlaces(data.filter(p => p.id)));
  }, []);

  const active = places[activeIdx];

  return (
    <div className="h-dvh bg-background flex flex-col overflow-hidden font-['Manrope'] antialiased">
      {/* TopBar */}
      <header className="bg-surface border-b border-outline-variant flex justify-between items-center px-5 py-4 z-40 shrink-0">
        <div className="flex items-center gap-3">
          <button className="p-2 -ml-2 rounded-full hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-primary">menu</span>
          </button>
          <h1 className="text-[24px] font-['Montserrat'] font-bold text-primary">CityScan</h1>
        </div>
        <div className="w-9 h-9 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center">
          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">person</span>
        </div>
      </header>

      {/* Map area */}
      <div className="h-[45%] relative bg-[#ebeae4] shrink-0">
        {/* Route info overlay */}
        <div className="absolute top-3 left-3 right-3 z-10">
          <div className="bg-surface/95 backdrop-blur-sm border border-outline-variant rounded-xl p-3 shadow-md">
            <h2 className="text-[16px] font-['Montserrat'] font-semibold text-primary">Svishtov Cultural Route</h2>
            <div className="flex items-center gap-2 text-on-surface-variant font-['IBM_Plex_Mono'] text-[12px] mt-0.5">
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
              <span>AI-built · Half day · {places.length} stops</span>
            </div>
          </div>
        </div>

        {/* SVG mock map */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1000 600">
          <path fill="#aadaff" d="M0,100 C300,150 600,50 1000,200 L1000,600 L0,600 Z" />
          <path fill="#ebeae4" d="M0,150 C300,200 600,100 1000,250 L1000,600 L0,600 Z" />
          <path stroke="#ffffff" strokeWidth="6" fill="none" strokeLinecap="round" d="M-50,300 L250,350 L500,250 L800,400 L1050,350" />
          <path stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" d="M300,350 L350,450 L450,480" />
          <path stroke="#1a73e8" strokeWidth="4" strokeDasharray="8,4" fill="none" d="M300,350 L450,420 L550,300 L700,450 L800,250 L900,400" />
        </svg>

        {/* Pins */}
        {places.map((p, i) => {
          const positions = [
            { top: '58%', left: '30%' }, { top: '70%', left: '45%' },
            { top: '50%', left: '55%' }, { top: '75%', left: '70%' },
            { top: '41%', left: '80%' }, { top: '66%', left: '90%' },
          ];
          const pos = positions[i] || { top: '50%', left: '50%' };
          const isActive = i === activeIdx;
          return (
            <button
              key={p.id}
              onClick={() => setActiveIdx(i)}
              className="absolute z-20 flex flex-col items-center"
              style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)' }}
            >
              <div className={`rounded-full border-[3px] border-surface flex items-center justify-center shadow-md transition-transform active:scale-110 ${
                isActive ? 'w-9 h-9 bg-primary' : 'w-7 h-7 bg-surface border-primary'
              }`}>
                <span className={`font-['IBM_Plex_Mono'] font-bold ${isActive ? 'text-on-primary text-[13px]' : 'text-primary text-[11px]'}`}>{i + 1}</span>
              </div>
              {isActive && (
                <div className="mt-1 bg-surface px-2 py-0.5 rounded text-[10px] font-['IBM_Plex_Mono'] border border-outline-variant shadow-sm whitespace-nowrap font-bold">
                  {p.name || p.id}
                </div>
              )}
            </button>
          );
        })}

        {/* Map controls */}
        <div className="absolute right-3 bottom-3 z-10 flex flex-col gap-2">
          <button className="w-10 h-10 bg-surface border border-outline-variant rounded-full flex items-center justify-center shadow-sm text-on-surface-variant">
            <span className="material-symbols-outlined">my_location</span>
          </button>
        </div>
      </div>

      {/* Details panel */}
      {active && (
        <div className="flex-1 bg-surface flex flex-col border-t border-outline-variant shadow-[0_-4px_16px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="px-5 pt-4 pb-3 border-b border-outline-variant shrink-0">
            <div className="flex justify-between items-center mb-2">
              <span className="font-['IBM_Plex_Mono'] text-[11px] text-on-surface-variant uppercase tracking-widest">Current Stop</span>
              <div className="flex items-center gap-2">
                <span className="font-['IBM_Plex_Mono'] text-[12px] text-primary">Stop {activeIdx + 1} of {places.length}</span>
                <div className="w-20 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${((activeIdx + 1) / places.length) * 100}%` }} />
                </div>
              </div>
            </div>
            <h3 className="text-[22px] font-['Montserrat'] font-semibold text-primary leading-tight">{activeIdx + 1}. {active.name || active.id}</h3>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center gap-2 p-3 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-primary text-[28px]">headphones</span>
                <span className="font-['IBM_Plex_Mono'] text-[11px] text-center text-on-surface">AI Audio Story</span>
              </button>
              <button
                onClick={() => navigate('/concierge')}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-primary text-[28px]">chat</span>
                <span className="font-['IBM_Plex_Mono'] text-[11px] text-center text-on-surface">Ask Concierge</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-surface border-t border-outline-variant flex gap-3 shrink-0">
            <button
              onClick={() => setActiveIdx(i => Math.min(i + 1, places.length - 1))}
              className="flex-1 bg-surface border border-outline-variant text-on-surface py-3 px-4 rounded-lg font-['IBM_Plex_Mono'] text-[13px] shadow-sm active:scale-95 transition-transform"
            >
              Next stop
            </button>
            <button
              onClick={() => navigate(`/compendium`)}
              className="flex-[2] bg-primary text-on-primary py-3 px-4 rounded-lg font-['IBM_Plex_Mono'] text-[13px] shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              Open stop <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      <BottomNav active="Routes" />
    </div>
  );
};

export default RouteMap;
