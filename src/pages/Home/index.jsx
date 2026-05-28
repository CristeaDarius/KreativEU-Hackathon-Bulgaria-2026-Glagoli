import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNarration } from '../../context/NarrationContext';
import { fetchPlaces, getPlaceName } from '../../lib/api';
import { getPlan, getProfile, getVisited } from '../../lib/appState';
import TTSHighlight from '../../components/TTSHighlight';

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setNarrationKeys } = useNarration();
  const [places, setPlaces] = useState([]);
  const [plan, setPlan] = useState(null);
  const [visited, setVisited] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setNarrationKeys(['home.plan_day', 'home.plan_another', 'home.continue_route', 'home.route_ready', 'home.no_route', 'home.your_stops', 'home.ready', 'home.map', 'home.active_route', 'home.completed_route', 'home.no_route_yet', 'home.heritage_stop', 'home.empty']);
    setPlan(getPlan());
    setVisited(getVisited());
    setProfile(getProfile());
    setLoading(true);
    fetchPlaces()
      .then(setPlaces)
      .catch(() => setError(t('home.error')))
      .finally(() => setLoading(false));
  }, []);

  const routePlaces = plan?.placeIds?.length
    ? plan.placeIds.map(id => places.find(place => place.id.toLowerCase() === id.toLowerCase())).filter(Boolean)
    : places.slice(0, 4);

  const hasRoute = Boolean(plan?.placeIds?.length);
  const routeEnded = Boolean(plan?.endedAt);
  const primaryAction = !hasRoute || routeEnded
    ? { label: routeEnded ? <TTSHighlight ttsKey="home.plan_another">{t('home.plan_another')}</TTSHighlight> : <TTSHighlight ttsKey="home.plan_day">{t('home.plan_day')}</TTSHighlight>, path: '/build', icon: 'auto_awesome' }
    : { label: <TTSHighlight ttsKey="home.continue_route">{t('home.continue_route')}</TTSHighlight>, path: '/route-map', icon: 'route' };

  return (
    <div className="px-5 pt-5 pb-8 flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-[28px] bg-primary text-on-primary p-6 min-h-[238px] flex flex-col justify-between shadow-[0_12px_36px_rgba(0,38,46,0.16)]">
        <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-primary-fixed/20" />
        <div className="absolute right-6 bottom-5 stamp-shape w-16 h-16 bg-secondary flex items-center justify-center rotate-6">
          <span className="material-symbols-outlined text-on-secondary text-[34px]">auto_awesome</span>
        </div>
        <div className="relative z-10 flex flex-col gap-3 max-w-[260px]">
          <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.18em] text-primary-fixed-dim"><TTSHighlight ttsKey="topbar.today">{t('topbar.today')}</TTSHighlight></span>
          <h1 className="text-[34px] leading-[38px] font-['Stack_Sans_Headline'] font-bold tracking-tight">{t('home.greeting', { name: 'there' })}</h1>
          <p className="text-[15px] leading-6 text-primary-fixed-dim">
            {hasRoute && !routeEnded ? <TTSHighlight ttsKey="home.route_ready">{t('home.route_ready')}</TTSHighlight> : <TTSHighlight ttsKey="home.no_route">{t('home.no_route')}</TTSHighlight>}
          </p>
        </div>
        <button type="button" onClick={() => navigate(primaryAction.path)}
          className="relative z-10 mt-6 w-full bg-primary-fixed text-on-primary-fixed py-4 rounded-2xl font-['IBM_Plex_Mono'] text-[14px] font-bold tracking-wide flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          {primaryAction.label} <span className="material-symbols-outlined text-[19px]">{primaryAction.icon}</span>
        </button>
      </section>

      <section className="grid grid-cols-3 gap-3">
        {[
          { key: 'city', value: plan?.city || <TTSHighlight ttsKey="home.not_set">{t('home.not_set')}</TTSHighlight>, label: <TTSHighlight ttsKey="home.city">{t('home.city')}</TTSHighlight> },
          { key: 'time', value: plan?.time || <TTSHighlight ttsKey="home.choose">{t('home.choose')}</TTSHighlight>, label: <TTSHighlight ttsKey="home.time">{t('home.time')}</TTSHighlight> },
          { key: 'visited', value: visited.length, label: <TTSHighlight ttsKey="home.visited">{t('home.visited')}</TTSHighlight> },
        ].map(stat => (
          <article key={stat.key} className="rounded-2xl bg-surface-container-lowest border border-outline-variant p-3 min-h-[86px] flex flex-col justify-between shadow-sm">
            <span className="text-[20px] leading-6 font-['Stack_Sans_Headline'] font-bold text-primary truncate">{stat.value}</span>
            <span className="font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-outline">{stat.label}</span>
          </article>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-outline">
              {hasRoute ? routeEnded ? <TTSHighlight ttsKey="home.completed_route">{t('home.completed_route')}</TTSHighlight> : <TTSHighlight ttsKey="home.active_route">{t('home.active_route')}</TTSHighlight> : <TTSHighlight ttsKey="home.no_route_yet">{t('home.no_route_yet')}</TTSHighlight>}
            </span>
            <h2 className="text-[24px] font-['Stack_Sans_Headline'] font-semibold text-primary">{hasRoute ? <TTSHighlight ttsKey="home.your_stops">{t('home.your_stops')}</TTSHighlight> : <TTSHighlight ttsKey="home.ready">{t('home.ready')}</TTSHighlight>}</h2>
          </div>
          {hasRoute && <button type="button" onClick={() => navigate('/route-map')} className="text-primary font-['IBM_Plex_Mono'] text-[12px] font-bold"><TTSHighlight ttsKey="home.map">{t('home.map')}</TTSHighlight></button>}
        </div>

        {loading && <div className="rounded-2xl bg-surface-container p-5 text-on-surface-variant"><TTSHighlight ttsKey="home.loading">{t('home.loading')}</TTSHighlight></div>}
        {error && <div className="rounded-2xl bg-error-container p-5 text-on-error-container">{error}</div>}

        {!loading && !error && !hasRoute && (
          <div className="rounded-2xl bg-surface-container p-5 text-on-surface-variant leading-6"><TTSHighlight ttsKey="home.empty">{t('home.empty')}</TTSHighlight></div>
        )}

        {!loading && !error && hasRoute && routePlaces.map((place, index) => (
          <button type="button" key={place.id} onClick={() => navigate(`/visit/${encodeURIComponent(place.id)}`)}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-[22px] p-4 flex items-center gap-4 text-left shadow-sm active:scale-[0.99] transition-transform"
          >
            <span className="w-12 h-12 rounded-2xl bg-secondary-container text-secondary flex items-center justify-center shrink-0 font-['IBM_Plex_Mono'] font-bold">{index + 1}</span>
            <span className="flex-1 min-w-0">
              <span className="block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-outline"><TTSHighlight ttsKey="home.heritage_stop">{t('home.heritage_stop')}</TTSHighlight></span>
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
