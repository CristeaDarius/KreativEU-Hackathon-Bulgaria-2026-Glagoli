import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('/api/places')
      .then(r => {
        if (!r.ok) throw new Error('Unable to load places');
        return r.json();
      })
      .then(data => setPlaces(data.filter(place => place.id)))
      .catch(() => setError('Places are unavailable right now.'))
      .finally(() => setLoading(false));
  }, []);

  const featured = places.slice(0, 4);

  return (
    <div className="px-5 pt-5 flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-[28px] bg-primary text-on-primary p-6 min-h-[238px] flex flex-col justify-between shadow-[0_12px_36px_rgba(0,38,46,0.16)]">
        <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-primary-fixed/20" />
        <div className="absolute right-6 bottom-5 stamp-shape w-16 h-16 bg-tertiary-fixed/90 flex items-center justify-center rotate-6">
          <span className="material-symbols-outlined text-tertiary-container text-[34px]">local_library</span>
        </div>
        <div className="relative z-10 flex flex-col gap-3 max-w-[260px]">
          <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.18em] text-primary-fixed-dim">Svishtov cultural route</span>
          <h1 className="text-[34px] leading-[38px] font-['Montserrat'] font-bold tracking-tight">Explore the city through living stories.</h1>
          <p className="text-[15px] leading-6 text-primary-fixed-dim">Build a route, open the map, and ask the AI guide about every stop.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/build')}
          className="relative z-10 mt-6 w-full bg-primary-fixed text-on-primary-fixed py-4 rounded-2xl font-['IBM_Plex_Mono'] text-[14px] font-bold tracking-wide flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          Build my route <span className="material-symbols-outlined text-[19px]">auto_awesome</span>
        </button>
      </section>

      <section className="grid grid-cols-2 gap-3">
        {[
          { label: 'Half day', icon: 'schedule' },
          { label: 'Accessible', icon: 'accessible_forward' },
          { label: 'Families', icon: 'family_restroom' },
          { label: 'Hidden stories', icon: 'travel_explore' },
        ].map(item => (
          <button key={item.label} type="button" onClick={() => navigate('/build')} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 min-h-[96px] flex flex-col justify-between text-left active:scale-[0.98] transition-transform shadow-sm">
            <span className="material-symbols-outlined text-primary text-[28px]">{item.icon}</span>
            <span className="font-['IBM_Plex_Mono'] text-[12px] text-on-surface font-bold uppercase tracking-wide">{item.label}</span>
          </button>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-outline">Route stops</span>
            <h2 className="text-[24px] font-['Montserrat'] font-semibold text-primary">Featured places</h2>
          </div>
          <button type="button" onClick={() => navigate('/route-map')} className="text-primary font-['IBM_Plex_Mono'] text-[12px] font-bold">Map</button>
        </div>

        {loading && <div className="rounded-2xl bg-surface-container p-5 text-on-surface-variant">Loading places...</div>}
        {error && <div className="rounded-2xl bg-error-container p-5 text-on-error-container">{error}</div>}

        {!loading && !error && featured.map((place, index) => (
          <button
            type="button"
            key={place.id}
            onClick={() => navigate('/concierge', { state: { placeId: place.id } })}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-[22px] p-4 flex items-center gap-4 text-left shadow-sm active:scale-[0.99] transition-transform"
          >
            <span className="w-12 h-12 rounded-2xl bg-secondary-container text-secondary flex items-center justify-center shrink-0 font-['IBM_Plex_Mono'] font-bold">{index + 1}</span>
            <span className="flex-1 min-w-0">
              <span className="block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-outline">Heritage stop</span>
              <span className="block text-[18px] leading-6 font-['Montserrat'] font-semibold text-on-surface truncate">{place.name || place.id}</span>
            </span>
            <span className="material-symbols-outlined text-primary">arrow_forward</span>
          </button>
        ))}
      </section>
    </div>
  );
};

export default Home;
