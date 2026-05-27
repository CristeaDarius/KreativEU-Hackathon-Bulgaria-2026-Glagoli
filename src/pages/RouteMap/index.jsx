import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
  const [places, setPlaces] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/places')
      .then(r => r.json())
      .then(data => Promise.all(
        data
          .filter(p => p.id)
          .map((place, index) => fetch(`/api/places/${place.id}`)
            .then(r => r.ok ? r.json() : place)
            .then(details => ({
              ...place,
              ...details,
              latitude: details.latitude || FALLBACK_PINS[index % FALLBACK_PINS.length].lat,
              longitude: details.longitude || FALLBACK_PINS[index % FALLBACK_PINS.length].lng,
            })))
      ))
      .then(setPlaces)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current).setView([43.605, 25.371], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapInstance.current);

    markerLayer.current = L.layerGroup().addTo(mapInstance.current);

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
      markerLayer.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !markerLayer.current || !places.length) return;

    markerLayer.current.clearLayers();
    const bounds = [];
    places.forEach((place, i) => {
      const lat = place.latitude;
      const lng = place.longitude;
      if (!lat || !lng) return;
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:34px;height:34px;border-radius:50%;background:${i === activeIdx ? '#00262e' : '#FAF6ED'};border:2px solid ${i === activeIdx ? '#FAF6ED' : '#00262e'};display:flex;align-items:center;justify-content:center;font-family:'IBM Plex Mono',monospace;font-weight:700;font-size:13px;color:${i === activeIdx ? '#fff' : '#00262e'};box-shadow:0 3px 12px rgba(0,0,0,0.22)">${i + 1}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      L.marker([lat, lng], { icon }).on('click', () => setActiveIdx(i)).addTo(markerLayer.current);
      bounds.push([lat, lng]);
    });

    if (bounds.length) mapInstance.current.fitBounds(bounds, { padding: [42, 42] });
  }, [places, activeIdx]);

  const active = places[activeIdx];

  return (
    <div className="h-full bg-background text-on-surface flex flex-col overflow-hidden font-['Manrope'] antialiased">
      {/* Map */}
      <main className="flex-1 relative overflow-hidden">
        <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />

        {/* Route info overlay */}
        <div className="absolute top-4 left-4 right-4 z-10 pointer-events-none">
          <div className="bg-surface/90 backdrop-blur-sm border border-outline-variant rounded-xl p-4 shadow-[0_4px_24px_rgba(0,38,46,0.06)]">
            <h2 className="text-[22px] font-['Montserrat'] font-semibold text-primary mb-1">Svishtov Cultural Route</h2>
            <div className="flex items-center gap-2 text-on-surface-variant font-['IBM_Plex_Mono'] text-[13px]">
              <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
              <span>{loading ? 'Building route...' : `AI-built route · Half day · ${places.length} stops`}</span>
            </div>
          </div>
        </div>

        {/* Bottom sheet */}
        {active && (
          <div className="absolute bottom-[86px] left-0 w-full bg-surface rounded-t-3xl shadow-[0_-8px_32px_rgba(0,38,46,0.08)] border border-outline-variant z-10 flex flex-col max-h-[58%]">
            <div className="w-full flex justify-center pt-3 pb-1">
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
                type="button"
                onClick={() => setActiveIdx(i => Math.min(i + 1, places.length - 1))}
                className="flex-1 bg-surface border border-outline-variant border-b-2 border-b-[#cec6b3] text-on-surface py-3 rounded-lg font-['IBM_Plex_Mono'] text-[13px] hover:bg-surface-container-high transition-colors"
              >
                Next stop
              </button>
              <button
                type="button"
                onClick={() => navigate('/compendium')}
                className="flex-[2] bg-primary border-b-2 border-b-[#123c46] text-on-primary py-3 rounded-lg font-['IBM_Plex_Mono'] text-[13px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                Open stop <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RouteMap;
