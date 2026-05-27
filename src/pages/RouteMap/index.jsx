import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchPlace, fetchPlaces, getPlaceName } from '../../lib/api';
import { getPlan } from '../../lib/appState';

// Fix default marker icons broken by Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow });

const FALLBACK_PINS = [
  { lat: 43.61197395612641, lng: 25.356363551695033 },
  { lat: 43.59754286558995, lng: 25.385690394306934 },
  { lat: 43.6182, lng: 25.3498 },
  { lat: 43.6054, lng: 25.3608 },
  { lat: 43.6089, lng: 25.3742 },
  { lat: 43.6003, lng: 25.3701 },
  { lat: 43.6131, lng: 25.3814 },
  { lat: 43.5948, lng: 25.3635 },
];

const RouteMap = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerLayer = useRef(null);
  const hasFitBounds = useRef(false);
  const [places, setPlaces] = useState([]);
  const [plan, setPlan] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    hasFitBounds.current = false;
    const savedPlan = getPlan();
    setPlan(savedPlan);
    fetchPlaces()
      .then(data => {
        const planned = savedPlan?.placeIds?.length
          ? savedPlan.placeIds.map(id => data.find(place => place.id.toLowerCase() === id.toLowerCase())).filter(Boolean)
          : data;

        return Promise.all(
          planned
          .map((place, index) => fetchPlace(place.id)
            .catch(() => place)
            .then(details => ({
              ...place,
              ...details,
              latitude: details.latitude || FALLBACK_PINS[index % FALLBACK_PINS.length].lat,
              longitude: details.longitude || FALLBACK_PINS[index % FALLBACK_PINS.length].lng,
            })))
        );
      })
      .then(setPlaces)
      .catch(() => setError('The route map cannot load stops right now.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current).setView([43.605, 25.371], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapInstance.current);

    markerLayer.current = L.layerGroup().addTo(mapInstance.current);

    const fixSize = () => mapInstance.current?.invalidateSize(false);
    const resizeObserver = new ResizeObserver(fixSize);
    resizeObserver.observe(mapRef.current);
    setTimeout(fixSize, 0);
    setTimeout(fixSize, 250);

    return () => {
      resizeObserver.disconnect();
      mapInstance.current?.remove();
      mapInstance.current = null;
      markerLayer.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !markerLayer.current || !places.length) return;

    mapInstance.current.invalidateSize(false);

    markerLayer.current.clearLayers();
    const bounds = [];
    places.forEach((place, i) => {
      const lat = place.latitude;
      const lng = place.longitude;
      if (!lat || !lng) return;
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:34px;height:34px;border-radius:50%;background:${i === activeIdx ? '#104040' : '#F6F1E8'};border:2px solid ${i === activeIdx ? '#F6F1E8' : '#104040'};display:flex;align-items:center;justify-content:center;font-family:'IBM Plex Mono',monospace;font-weight:700;font-size:13px;color:${i === activeIdx ? '#fff' : '#104040'};box-shadow:0 3px 12px rgba(0,0,0,0.22)">${i + 1}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      L.marker([lat, lng], { icon }).on('click', () => setActiveIdx(i)).addTo(markerLayer.current);
      bounds.push([lat, lng]);
    });

    if (bounds.length) {
      const activePlace = places[activeIdx];
      if (!hasFitBounds.current) {
        mapInstance.current.fitBounds(bounds, { padding: [42, 42] });
        hasFitBounds.current = true;
      } else if (activePlace?.latitude && activePlace?.longitude) {
        mapInstance.current.panTo([activePlace.latitude, activePlace.longitude], { animate: true });
      }
    }
    setTimeout(() => mapInstance.current?.invalidateSize(false), 120);
  }, [places, activeIdx]);

  const active = places[activeIdx];

  return (
    <div className="min-h-full bg-background text-on-surface px-5 pt-4 pb-8 flex flex-col gap-4 font-['Manrope'] antialiased">
      <section className="bg-surface-container-lowest border border-outline-variant rounded-[24px] p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-outline">Generated route</span>
            <h1 className="text-[26px] leading-8 font-['Stack_Sans_Headline'] font-bold text-primary mt-1">{plan?.city || 'Svishtov'} Route</h1>
          </div>
          <button type="button" onClick={() => navigate('/build')} className="shrink-0 bg-primary-fixed text-on-primary-fixed rounded-full px-3 py-2 font-['IBM_Plex_Mono'] text-[11px] font-bold">Edit</button>
        </div>
        <p className="text-on-surface-variant font-['IBM_Plex_Mono'] text-[12px] mt-2">
          {loading ? 'Building route...' : error || `${plan?.mood || 'AI-built'} · ${plan?.time || 'Today'} · ${places.length} stops`}
        </p>
      </section>

      <section className="relative h-[42dvh] min-h-[300px] rounded-[28px] overflow-hidden border border-outline-variant shadow-sm bg-surface-container">
        <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />
        {!loading && !active && (
          <div className="absolute inset-x-4 top-4 z-10 rounded-2xl bg-surface/95 backdrop-blur border border-outline-variant p-5 text-on-surface-variant shadow-sm">
            {error || 'No route stops are available yet.'}
          </div>
        )}
      </section>

      {active && (
        <section className="bg-surface-container-lowest border border-outline-variant rounded-[28px] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-outline-variant">
            <div className="flex justify-between items-center mb-2">
              <span className="font-['IBM_Plex_Mono'] text-[12px] text-on-surface-variant uppercase">Current Stop</span>
              <span className="font-['IBM_Plex_Mono'] text-[12px] text-primary">{activeIdx + 1}/{places.length}</span>
            </div>
            <h2 className="text-[24px] leading-8 font-['Stack_Sans_Headline'] font-bold text-primary">{getPlaceName(active)}</h2>
            <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden mt-4">
              <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${((activeIdx + 1) / places.length) * 100}%` }} />
            </div>
          </div>

          <div className="p-5 flex flex-col gap-4">
            <p className="text-[15px] text-on-surface leading-6 line-clamp-4">
              {active.additional_info || 'A cultural memory point connected to Svishtov identity.'}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => navigate('/concierge', { state: { placeId: active.id } })} className="bg-surface border border-outline-variant text-on-surface py-3 rounded-2xl font-['IBM_Plex_Mono'] text-[12px] font-bold active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">forum</span> Guide
              </button>
              <button type="button" onClick={() => navigate('/settings')} className="bg-surface border border-outline-variant text-on-surface py-3 rounded-2xl font-['IBM_Plex_Mono'] text-[12px] font-bold active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">accessible_forward</span> Access
              </button>
            </div>
            <div className="grid grid-cols-[1fr_1.6fr] gap-3">
              <button type="button" onClick={() => setActiveIdx(i => Math.min(i + 1, places.length - 1))} disabled={activeIdx >= places.length - 1} className="bg-surface border border-outline-variant text-on-surface py-4 rounded-2xl font-['IBM_Plex_Mono'] text-[13px] font-bold active:scale-[0.98] transition-transform disabled:opacity-45">Next</button>
              <button type="button" onClick={() => navigate(`/visit/${encodeURIComponent(active.id)}`)} className="bg-primary text-on-primary py-4 rounded-2xl font-['IBM_Plex_Mono'] text-[13px] font-bold active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                Go there <span className="material-symbols-outlined text-[18px]">near_me</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {places.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-[22px] font-['Stack_Sans_Headline'] font-bold text-primary">Route list</h2>
          {places.map((place, index) => (
            <button key={place.id} type="button" onClick={() => setActiveIdx(index)} className={`w-full rounded-2xl border p-4 flex items-center gap-3 text-left active:scale-[0.99] transition-all ${index === activeIdx ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-lowest text-on-surface border-outline-variant'}`}>
              <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-['IBM_Plex_Mono'] font-bold ${index === activeIdx ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-secondary-container text-secondary'}`}>{index + 1}</span>
              <span className="flex-1 min-w-0 font-['Stack_Sans_Headline'] font-semibold truncate">{getPlaceName(place)}</span>
            </button>
          ))}
        </section>
      )}
    </div>
  );
};

export default RouteMap;
