import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';

const PINS = [
  { lat: 43.61197395612641, lng: 25.356363551695033, label: '1' },
  { lat: 43.59754286558995, lng: 25.385690394306934, label: '2' },
];

const RouteMapGoogle = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [places, setPlaces] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    fetch('/api/places').then(r => r.json()).then(data => setPlaces(data.filter(p => p.id)));
  }, []);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'your_google_maps_api_key_here') return;
    if (window.google) { initMap(); return; }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.onload = initMap;
    document.head.appendChild(script);

    return () => { document.head.removeChild(script); };
  }, []);

  const initMap = () => {
    if (!mapRef.current || !window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 43.605, lng: 25.371 },
      zoom: 14,
      disableDefaultUI: true,
      zoomControl: true,
    });

    PINS.forEach((pin, i) => {
      new window.google.maps.Marker({
        position: { lat: pin.lat, lng: pin.lng },
        map,
        label: { text: pin.label, color: '#ffffff', fontFamily: 'IBM Plex Mono', fontWeight: '700' },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 16,
          fillColor: i === 0 ? '#00262e' : '#FAF6ED',
          fillOpacity: 1,
          strokeColor: i === 0 ? '#FAF6ED' : '#00262e',
          strokeWeight: 2,
        },
      });
    });
  };

  const active = places[activeIdx];

  return (
    <div className="h-dvh bg-background text-on-surface flex flex-col overflow-hidden font-['Manrope'] antialiased">
      {/* TopAppBar */}
      <header className="bg-surface border-b border-outline-variant flex justify-between items-center w-full px-5 md:px-10 py-4 z-40 shrink-0">
        <div className="flex items-center gap-4">
          <button className="p-2 -ml-2 rounded-full hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-primary">menu</span>
          </button>
          <h1 className="text-[24px] font-['Montserrat'] font-bold tracking-tight text-primary">CityScan</h1>
        </div>
        <button className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
          <div className="w-full h-full bg-surface-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">person</span>
          </div>
        </button>
      </header>

      {/* Map */}
      <main className="flex-1 relative overflow-hidden">
        <div ref={mapRef} className="absolute inset-0 w-full h-full" />

        {/* Fallback if no API key */}
        {(!import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_MAPS_API_KEY === 'your_google_maps_api_key_here') && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-container">
            <p className="font-['IBM_Plex_Mono'] text-[13px] text-on-surface-variant text-center px-6">
              Add your Google Maps API key to <code>.env</code> as<br />
              <strong>VITE_GOOGLE_MAPS_API_KEY</strong>
            </p>
          </div>
        )}

        {/* Route info overlay */}
        <div className="absolute top-4 left-4 right-4 md:left-10 md:right-auto md:w-96 z-10">
          <div className="bg-surface/90 backdrop-blur-sm border border-outline-variant rounded-xl p-4 shadow-[0_4px_24px_rgba(0,38,46,0.06)]">
            <h2 className="text-[24px] font-['Montserrat'] font-semibold text-primary mb-1">Svishtov Cultural Route</h2>
            <div className="flex items-center gap-2 text-on-surface-variant font-['IBM_Plex_Mono'] text-[14px]">
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              <span>AI-built route · Half day · {places.length} stops</span>
            </div>
          </div>
        </div>

        {/* Bottom sheet */}
        {active && (
          <div className="absolute bottom-0 left-0 w-full md:w-[480px] md:left-auto md:right-10 md:bottom-5 bg-surface rounded-t-3xl md:rounded-3xl shadow-[0_-8px_32px_rgba(0,38,46,0.08)] border border-outline-variant z-30 flex flex-col max-h-[60%]">
            <div className="w-full flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-12 h-1.5 bg-outline-variant rounded-full" />
            </div>

            <div className="px-6 pt-3 pb-3 border-b border-outline-variant shrink-0">
              <div className="flex justify-between items-center mb-2">
                <span className="font-['IBM_Plex_Mono'] text-[12px] text-on-surface-variant uppercase">Current Stop</span>
                <div className="flex items-center gap-2">
                  <span className="font-['IBM_Plex_Mono'] text-[12px] text-primary">Stop {activeIdx + 1} of {places.length}</span>
                  <div className="w-24 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${((activeIdx + 1) / places.length) * 100}%` }} />
                  </div>
                </div>
              </div>
              <h3 className="text-[22px] font-['Montserrat'] font-semibold text-primary leading-tight mb-2">
                {activeIdx + 1}. {active.name || active.id}
              </h3>
              <div className="flex flex-wrap items-center gap-3 font-['IBM_Plex_Mono'] text-[13px] text-on-surface-variant">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">museum</span> Heritage site</span>
                <span>·</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">schedule</span> 35 min</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1 bg-[#ffb68e]/20 text-[#73350a] px-2 py-0.5 rounded-sm border border-[#ffb68e]/50">
                  <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                  Heritage Explorer
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <p className="text-[16px] font-['Manrope'] text-on-surface leading-relaxed">
                {active.additional_info || 'A cultural memory point connected to Svishtov identity.'}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center justify-center gap-2 p-3 bg-surface-container-lowest border border-outline-variant rounded-xl hover:bg-surface-container-low transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-primary text-[28px]">headphones</span>
                  <span className="font-['IBM_Plex_Mono'] text-[12px] text-center">AI Audio Story</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 p-3 bg-surface-container-lowest border border-outline-variant rounded-xl hover:bg-surface-container-low transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-primary text-[28px]">accessible_forward</span>
                  <span className="font-['IBM_Plex_Mono'] text-[12px] text-center">Accessible Mode</span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-surface border-t border-outline-variant flex gap-3 shrink-0">
              <button
                onClick={() => setActiveIdx(i => Math.min(i + 1, places.length - 1))}
                className="flex-1 bg-surface border border-outline-variant border-b-2 border-b-[#cec6b3] text-on-surface py-3 rounded-lg font-['IBM_Plex_Mono'] text-[13px] hover:bg-surface-container-high transition-colors"
              >
                Next stop
              </button>
              <button
                onClick={() => navigate('/compendium')}
                className="flex-[2] bg-primary border-b-2 border-b-[#123c46] text-on-primary py-3 rounded-lg font-['IBM_Plex_Mono'] text-[13px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                Open stop <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}
      </main>

      <BottomNav active="Routes" />
    </div>
  );
};

export default RouteMapGoogle;
