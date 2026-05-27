import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPlaces, getPlaceName } from '../../lib/api';
import { getPlan, getProfile, getVisited } from '../../lib/appState';

const Home = () => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [plan, setPlan] = useState(null);
  const [visited, setVisited] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setPlan(getPlan());
    setVisited(getVisited());
    setProfile(getProfile());
    setLoading(true);
    fetchPlaces()
      .then(setPlaces)
      .catch(() => setError('Places are unavailable right now. Start with the route builder or try again later.'))
      .finally(() => setLoading(false));
  }, []);

  const routePlaces = plan?.placeIds?.length
    ? plan.placeIds.map(id => places.find(place => place.id.toLowerCase() === id.toLowerCase())).filter(Boolean)
    : places.slice(0, 4);

  const greetingName = profile?.gender && profile.gender !== 'Prefer not to say' ? 'there' : 'there';

  return (
    <div className="px-5 pt-5 flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-[28px] bg-primary text-on-primary p-6 min-h-[238px] flex flex-col justify-between shadow-[0_12px_36px_rgba(0,38,46,0.16)]">
        <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-primary-fixed/20" />
        <div className="absolute right-6 bottom-5 stamp-shape w-16 h-16 bg-secondary flex items-center justify-center rotate-6">
          <span className="material-symbols-outlined text-on-secondary text-[34px]">auto_awesome</span>
        </div>
        <div className="relative z-10 flex flex-col gap-3 max-w-[260px]">
          <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.18em] text-primary-fixed-dim">Today</span>
          <h1 className="text-[34px] leading-[38px] font-['Stack_Sans_Headline'] font-bold tracking-tight">Hi {greetingName}! What are you up to today?</h1>
          <p className="text-[15px] leading-6 text-primary-fixed-dim">Answer a few app-style choices and Locaia will build the route, list, and map.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/build')}
          className="relative z-10 mt-6 w-full bg-primary-fixed text-on-primary-fixed py-4 rounded-2xl font-['IBM_Plex_Mono'] text-[14px] font-bold tracking-wide flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          Start today's plan <span className="material-symbols-outlined text-[19px]">arrow_forward</span>
        </button>
      </section>

      <section className="grid grid-cols-3 gap-3">
        {[
          { value: plan?.city || 'Not set', label: 'City' },
          { value: plan?.time || 'Choose', label: 'Time' },
          { value: visited.length, label: 'Visited' },
        ].map(stat => (
          <article key={stat.label} className="rounded-2xl bg-surface-container-lowest border border-outline-variant p-3 min-h-[86px] flex flex-col justify-between shadow-sm">
            <span className="text-[20px] leading-6 font-['Stack_Sans_Headline'] font-bold text-primary truncate">{stat.value}</span>
            <span className="font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-outline">{stat.label}</span>
          </article>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-outline">{plan ? 'Generated plan' : 'Preview stops'}</span>
            <h2 className="text-[24px] font-['Stack_Sans_Headline'] font-semibold text-primary">{plan ? 'Your route list' : 'Places Locaia may use'}</h2>
          </div>
          <button type="button" onClick={() => navigate('/route-map')} className="text-primary font-['IBM_Plex_Mono'] text-[12px] font-bold">Map</button>
        </div>

        {loading && <div className="rounded-2xl bg-surface-container p-5 text-on-surface-variant">Loading places...</div>}
        {error && <div className="rounded-2xl bg-error-container p-5 text-on-error-container">{error}</div>}

        {!loading && !error && routePlaces.length === 0 && (
          <div className="rounded-2xl bg-surface-container p-5 text-on-surface-variant leading-6">No route stops are available yet.</div>
        )}

        {!loading && !error && routePlaces.map((place, index) => (
          <button
            type="button"
            key={place.id}
            onClick={() => navigate(`/visit/${encodeURIComponent(place.id)}`)}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-[22px] p-4 flex items-center gap-4 text-left shadow-sm active:scale-[0.99] transition-transform"
          >
            <span className="w-12 h-12 rounded-2xl bg-secondary-container text-secondary flex items-center justify-center shrink-0 font-['IBM_Plex_Mono'] font-bold">{index + 1}</span>
            <span className="flex-1 min-w-0">
              <span className="block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-outline">Heritage stop</span>
              <span className="block text-[18px] leading-6 font-['Stack_Sans_Headline'] font-semibold text-on-surface truncate">{getPlaceName(place)}</span>
            </span>
            <span className="material-symbols-outlined text-primary">near_me</span>
          </button>
        ))}
      </section>
    </div>
  );
};

export default Home;
