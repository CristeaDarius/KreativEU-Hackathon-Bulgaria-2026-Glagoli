import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="px-5 pt-5 flex flex-col gap-5">
      <section className="rounded-[28px] bg-primary text-on-primary p-6 shadow-sm">
        <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-primary-fixed-dim">Journey status</span>
        <h1 className="text-[30px] leading-9 font-['Stack_Sans_Headline'] font-bold mt-2">Your route is ready.</h1>
        <p className="text-primary-fixed-dim mt-3 leading-6">Open the map, continue collecting stories, or ask the guide about a stop.</p>
      </section>
      <section className="grid grid-cols-2 gap-3">
        {[
          { value: '8', label: 'Stops' },
          { value: '3', label: 'Badges' },
          { value: '42m', label: 'Audio' },
          { value: '1', label: 'Route' },
        ].map(stat => (
          <div key={stat.label} className="rounded-2xl bg-surface-container-lowest border border-outline-variant p-4">
            <span className="text-[32px] font-['Stack_Sans_Headline'] font-bold text-primary leading-none">{stat.value}</span>
            <span className="block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-outline mt-2">{stat.label}</span>
          </div>
        ))}
      </section>
      <button type="button" onClick={() => navigate('/route-map')} className="bg-primary text-on-primary rounded-2xl py-4 font-['IBM_Plex_Mono'] text-[14px] font-bold active:scale-[0.98] transition-transform">Open route map</button>
    </div>
  );
};

export default Dashboard;
