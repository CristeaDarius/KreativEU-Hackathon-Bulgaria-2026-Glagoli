import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchPlace, fetchPlaces, getPlaceName } from '../../lib/api';
import { getActiveStopIndex, getPlan, getVisited, markVisited, saveActiveStopIndex, savePlan } from '../../lib/appState';
import { useNarration } from '../../context/NarrationContext';
import { useTranslation } from 'react-i18next';

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
  const { setNarrationKeys } = useNarration();
  const { i18n } = useTranslation();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerLayer = useRef(null);
  const hasFitBounds = useRef(false);

  const [activeAudio, setActiveAudio] = useState(null);
  const [isPlayingDesc, setIsPlayingDesc] = useState(false);
  const descAudioRef = useRef(null);

  const [places, setPlaces] = useState([]);
  const [plan, setPlan] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [visitedIds, setVisitedIds] = useState([]);
  const [routeEnded, setRouteEnded] = useState(false);
  const [routeChatMessages, setRouteChatMessages] = useState([]);
  const [routeChatInput, setRouteChatInput] = useState('');
  const [routeChatLoading, setRouteChatLoading] = useState(false);
  const [routeChatError, setRouteChatError] = useState('');
  const [showRouteChat, setShowRouteChat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setNarrationKeys(['route_map.title', 'route_map.current_stop', 'route_map.heritage_site', 'route_map.next_stop', 'route_map.prev_stop', 'route_map.open_stop', 'route_map.mark_visited', 'route_map.go_there', 'route_map.end_route', 'route_map.route_ended', 'route_map.trip_summary', 'route_map.in_route_ai', 'route_map.ask_stop', 'route_map.fallback_desc']);
    setLoading(true);
    setError('');
    hasFitBounds.current = false;
    const savedPlan = getPlan();
    setPlan(savedPlan);
    setRouteEnded(Boolean(savedPlan?.endedAt));
    setActiveIdx(Math.max(0, getActiveStopIndex()));
    setVisitedIds(getVisited().map(place => place.id?.toLowerCase()).filter(Boolean));
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
    saveActiveStopIndex(activeIdx);
  }, [activeIdx]);

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
      const isVisited = visitedIds.includes(place.id?.toLowerCase());
      const isActive = i === activeIdx;
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:34px;height:34px;border-radius:50%;background:${isActive ? '#104040' : isVisited ? '#B07040' : '#F6F1E8'};border:2px solid ${isActive ? '#F6F1E8' : '#104040'};display:flex;align-items:center;justify-content:center;font-family:'IBM Plex Mono',monospace;font-weight:700;font-size:13px;color:${isActive || isVisited ? '#fff' : '#104040'};box-shadow:0 3px 12px rgba(0,0,0,0.22)">${isVisited ? '✓' : i + 1}</div>`,
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
  }, [places, activeIdx, visitedIds]);

  const active = places[activeIdx];
  const visitedCount = places.filter(place => visitedIds.includes(place.id?.toLowerCase())).length;
  const currentVisited = active ? visitedIds.includes(active.id?.toLowerCase()) : false;

  useEffect(() => {
    if (!active) return;
    setRouteChatMessages([
      { role: 'assistant', content: `I'm here on the route with you. Ask me anything about ${getPlaceName(active)}.` },
    ]);
    setRouteChatInput('');
    setRouteChatError('');
    setShowRouteChat(false);
  }, [active?.id]);

  const markCurrentVisited = () => {
    if (!active) return;
    markVisited(active);
    setVisitedIds(getVisited().map(place => place.id?.toLowerCase()).filter(Boolean));
  };

  const endRoute = () => {
    const completedPlan = { ...(plan || {}), endedAt: new Date().toISOString() };
    savePlan(completedPlan);
    setPlan(completedPlan);
    setRouteEnded(true);
  };

  const [routeChatAudio, setRouteChatAudio] = useState({}); // messageIndex -> audioUrl
  const [playingIdx, setPlayingIdx] = useState(null);
  const chatAudioRef = useRef(null);

  const playMessageAudio = (url, idx) => {
    if (chatAudioRef.current) { chatAudioRef.current.pause(); chatAudioRef.current = null; }
    if (playingIdx === idx) { setPlayingIdx(null); return; }
    const audio = new Audio(url);
    chatAudioRef.current = audio;
    setPlayingIdx(idx);
    audio.onended = () => { setPlayingIdx(null); chatAudioRef.current = null; };
    audio.onerror = () => { setPlayingIdx(null); chatAudioRef.current = null; };
    audio.play();
  };

  const generateAndPlayTTS = async (text, messageIdx) => {
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId: 'EXAVITQu4vr4xnSDxMaL' }), // Sarah
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setRouteChatAudio(prev => ({ ...prev, [messageIdx]: url }));
      playMessageAudio(url, messageIdx);
    } catch { /* silent fail */ }
  };

  const sendRouteChatMessage = async () => {
    if (!active || !routeChatInput.trim() || routeChatLoading) return;

    const userMessage = { role: 'user', content: routeChatInput.trim() };
    const updatedMessages = [...routeChatMessages, userMessage];
    setRouteChatMessages(updatedMessages);
    setRouteChatInput('');
    setRouteChatLoading(true);
    setRouteChatError('');

    try {
      if (!import.meta.env.VITE_MISTRAL_API_KEY) throw new Error('Missing Mistral API key');

      const langNames = { en: 'English', ro: 'Romanian', bg: 'Bulgarian', sk: 'Slovak', pl: 'Polish', cs: 'Czech' };
      const langName = langNames[i18n.language] || 'English';
      const descText = typeof active.description === 'object' && active.description !== null && Object.keys(active.description).length > 0
        ? Object.entries(active.description).filter(([k]) => k !== 'sources').map(([k, v]) => `${k}: ${v}`).join('\n\n')
        : active.additional_info || '';

      const systemMessage = {
        role: 'system',
        content: `You are Locaia's in-route guide for "${getPlaceName(active)}". Answer briefly and helpfully for a mobile user currently visiting this stop. Use only the description below. If the answer is not in the description, say you don't have that information. IMPORTANT: Always respond in ${langName}.\n\nDescription:\n${descText}`,
      };

      const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: import.meta.env.VITE_MISTRAL_MODEL || 'ministral-8b-latest',
          messages: [systemMessage, ...updatedMessages],
        }),
      });

      if (!res.ok) throw new Error('Unable to contact guide');
      const data = await res.json();
      const reply = data.choices?.[0]?.message;
      const finalMessages = reply ? [...updatedMessages, reply] : [...updatedMessages, { role: 'assistant', content: 'I could not create an answer from this stop description.' }];
      setRouteChatMessages(finalMessages);

      // Generate TTS for the AI reply
      const replyContent = finalMessages[finalMessages.length - 1]?.content;
      if (replyContent && finalMessages[finalMessages.length - 1]?.role === 'assistant') {
        generateAndPlayTTS(replyContent, finalMessages.length - 1);
      }
    } catch {
      setRouteChatError('AI guide is unavailable. Check the API key or try again later.');
    } finally {
      setRouteChatLoading(false);
    }
  };

  const handleRouteChatKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendRouteChatMessage();
    }
  };

  const toggleDescriptionAudio = () => {
    if (!active?.id) return;

    const audioPath = `/short_descriptions/${active.id.toLowerCase()}.mp3`;

    // stop if already playing
    if (descAudioRef.current) {
      descAudioRef.current.pause();
      descAudioRef.current = null;
      setIsPlayingDesc(false);
      setActiveAudio(null);
      return;
    }

    const audio = new Audio(audioPath);
    descAudioRef.current = audio;
    setActiveAudio(audioPath);
    setIsPlayingDesc(true);

    audio.onended = () => {
      descAudioRef.current = null;
      setIsPlayingDesc(false);
      setActiveAudio(null);
    };

    audio.onerror = () => {
      descAudioRef.current = null;
      setIsPlayingDesc(false);
      setActiveAudio(null);
    };

    audio.play().catch(() => {
      descAudioRef.current = null;
      setIsPlayingDesc(false);
      setActiveAudio(null);
    });
  };

  return (
    <div className="min-h-full bg-background text-on-surface px-5 pt-4 pb-8 flex flex-col gap-4 font-['Manrope'] antialiased">
      <section className="bg-surface-container-lowest border border-outline-variant rounded-[24px] p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-outline">{routeEnded ? 'Route complete' : 'Active route'}</span>
            <h1 className="text-[26px] leading-8 font-['Stack_Sans_Headline'] font-bold text-primary mt-1">{plan?.city || 'Svishtov'} Route</h1>
          </div>
          <button type="button" onClick={() => navigate('/build')} className="shrink-0 bg-primary-fixed text-on-primary-fixed rounded-full px-3 py-2 font-['IBM_Plex_Mono'] text-[11px] font-bold">New</button>
        </div>
        <p className="text-on-surface-variant font-['IBM_Plex_Mono'] text-[12px] mt-2">
          {loading ? 'Building route...' : error || `${visitedCount}/${places.length} visited · ${plan?.time || 'Today'} · ${plan?.mood || 'AI-built'}`}
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
          
          {active?.id && (
            <>
              {console.log('active:', active)}
              {console.log('image src:', `/images/${active.id}.jpeg`)}

              <div className="w-full h-[180px] overflow-hidden bg-surface-container">
                <img
                  src={`/images/${active.id}.jpeg`}
                  alt={getPlaceName(active)}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    if (e.currentTarget.dataset.fallback === "true") return;

                    e.currentTarget.dataset.fallback = "true";
                    console.log('image failed:', e.currentTarget.src);

                    e.currentTarget.src = '/images/fallback.jpeg';
                  }}
                />
              </div>
            </>
          )}
          
          <div className="p-5 border-b border-outline-variant">
            <div className="flex justify-between items-center mb-2">
              <span className="font-['IBM_Plex_Mono'] text-[12px] text-on-surface-variant uppercase">Current Stop</span>
              <span className={`font-['IBM_Plex_Mono'] text-[12px] ${currentVisited ? 'text-secondary' : 'text-primary'}`}>{currentVisited ? 'Visited' : `${activeIdx + 1}/${places.length}`}</span>
            </div>
            <h2 className="text-[24px] leading-8 font-['Stack_Sans_Headline'] font-bold text-primary">{getPlaceName(active)}</h2>
            <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden mt-4">
              <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${(visitedCount / places.length) * 100}%` }} />
            </div>
          </div>

          <div className="p-5 flex flex-col gap-4">
            <p className="text-[15px] text-on-surface leading-6">
              {active.additional_info || 'A cultural memory point connected to Svishtov identity.'}
            </p>
            <div className="grid grid-cols-3 gap-3">
              <button type="button" onClick={markCurrentVisited} className={`py-3 rounded-2xl font-['IBM_Plex_Mono'] text-[12px] font-bold active:scale-[0.98] transition-transform flex items-center justify-center gap-2 ${currentVisited ? 'bg-secondary text-on-secondary' : 'bg-surface border border-outline-variant text-on-surface'}`}>
                <span className="material-symbols-outlined text-[18px]">{currentVisited ? 'check_circle' : 'done'}</span> {currentVisited ? 'Visited' : 'Mark visited'}
              </button>

              <button
                  type="button"
                  onClick={toggleDescriptionAudio}
                  className="bg-surface border border-outline-variant text-on-surface py-3 rounded-2xl font-['IBM_Plex_Mono'] text-[12px] font-bold active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isPlayingDesc ? 'stop' : 'volume_up'}
                </span>
                {isPlayingDesc ? 'Stop' : 'Listen'}
              </button>

              <button type="button" onClick={() => navigate(`/visit/${encodeURIComponent(active.id)}`)} className="bg-primary text-on-primary py-3 rounded-2xl font-['IBM_Plex_Mono'] text-[12px] font-bold active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">near_me</span> Go there
              </button>
            </div>

            <section className="rounded-[24px] bg-surface border border-outline-variant p-3 flex flex-col gap-3 shadow-sm">
              <button type="button" onClick={() => setShowRouteChat(open => !open)} className="flex items-center justify-between gap-3 px-1 py-1 text-left active:scale-[0.99] transition-transform">
                <div>
                  <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-outline">In-route AI</span>
                  <h3 className="text-[18px] font-['Stack_Sans_Headline'] font-bold text-primary">Ask about this stop</h3>
                </div>
                <span className={`material-symbols-outlined text-primary transition-transform ${showRouteChat ? 'rotate-180' : ''}`}>expand_more</span>
              </button>

              {showRouteChat && (
                <>
                  <div className="max-h-48 overflow-y-auto custom-scrollbar flex flex-col gap-2 pr-1">
                    {routeChatMessages.map((message, index) => {
                      const isUser = message.role === 'user';
                      const audioUrl = routeChatAudio[index];
                      return (
                        <div key={`${message.role}-${index}`} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[88%] rounded-[18px] px-3 py-2 text-[13px] leading-5 ${isUser ? 'bg-primary text-on-primary rounded-br-md' : 'bg-surface-container-lowest border border-outline-variant text-on-surface rounded-bl-md'}`}>
                            {message.content}
                            {!isUser && audioUrl && (
                              <button
                                type="button"
                                onClick={() => playMessageAudio(audioUrl, index)}
                                className="mt-2 flex items-center gap-1 font-['IBM_Plex_Mono'] text-[11px] text-outline hover:text-primary transition-colors"
                              >
                                <span className="material-symbols-outlined text-[16px]">{playingIdx === index ? 'stop' : 'volume_up'}</span>
                                {playingIdx === index ? 'Stop' : 'Play'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {routeChatLoading && (
                      <div className="flex justify-start">
                        <div className="rounded-[18px] rounded-bl-md bg-surface-container-lowest border border-outline-variant px-3 py-2 text-[13px] text-on-surface-variant">Thinking...</div>
                      </div>
                    )}
                  </div>

                  {routeChatError && <div className="rounded-2xl bg-error-container text-on-error-container px-3 py-2 text-[12px] leading-5">{routeChatError}</div>}

                  <div className="app-control flex items-end gap-2 p-2">
                    <textarea
                      value={routeChatInput}
                      onChange={event => setRouteChatInput(event.target.value)}
                      onKeyDown={handleRouteChatKeyDown}
                      placeholder={`Ask about ${getPlaceName(active)}`}
                      rows={1}
                      className="app-textarea flex-1 resize-none outline-none px-3 py-2 text-[14px] max-h-24"
                    />
                    <button
                      type="button"
                      onClick={sendRouteChatMessage}
                      disabled={!routeChatInput.trim() || routeChatLoading}
                      className="w-11 h-11 rounded-2xl bg-primary text-on-primary flex items-center justify-center disabled:opacity-40 active:scale-95 transition-transform"
                      aria-label="Send route guide message"
                    >
                      <span className="material-symbols-outlined text-[20px]">send</span>
                    </button>
                  </div>
                </>
              )}
            </section>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setActiveIdx(i => Math.max(i - 1, 0))} disabled={activeIdx <= 0} className="bg-surface border border-outline-variant text-on-surface py-4 rounded-2xl font-['IBM_Plex_Mono'] text-[13px] font-bold active:scale-[0.98] transition-transform disabled:opacity-45">Previous</button>
              <button type="button" onClick={() => setActiveIdx(i => Math.min(i + 1, places.length - 1))} disabled={activeIdx >= places.length - 1} className="bg-surface border border-outline-variant text-on-surface py-4 rounded-2xl font-['IBM_Plex_Mono'] text-[13px] font-bold active:scale-[0.98] transition-transform disabled:opacity-45">Next</button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <button type="button" onClick={endRoute} className="bg-error-container text-on-error-container py-4 rounded-2xl font-['IBM_Plex_Mono'] text-[13px] font-bold active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                End route
              </button>
            </div>
          </div>
        </section>
      )}

      {routeEnded && (
        <section className="rounded-[28px] bg-primary text-on-primary p-6 shadow-sm flex flex-col gap-4">
          <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-primary-fixed-dim">Trip summary</span>
          <h2 className="text-[28px] leading-8 font-['Stack_Sans_Headline'] font-bold">Route ended</h2>
          <p className="text-primary-fixed-dim leading-6">You visited {visitedCount} of {places.length} stops. Saved heritage photos are available in your collection.</p>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => navigate('/today')} className="bg-primary-fixed text-on-primary-fixed py-3 rounded-2xl font-['IBM_Plex_Mono'] text-[12px] font-bold active:scale-[0.98] transition-transform">Today</button>
            <button type="button" onClick={() => navigate('/compendium')} className="bg-secondary text-on-secondary py-3 rounded-2xl font-['IBM_Plex_Mono'] text-[12px] font-bold active:scale-[0.98] transition-transform">Collection</button>
          </div>
        </section>
      )}

      {places.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-[22px] font-['Stack_Sans_Headline'] font-bold text-primary">Route list</h2>
          {places.map((place, index) => (
            <button key={place.id} type="button" onClick={() => setActiveIdx(index)} className={`w-full rounded-2xl border p-4 flex items-center gap-3 text-left active:scale-[0.99] transition-all ${index === activeIdx ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-lowest text-on-surface border-outline-variant'}`}>
              <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-['IBM_Plex_Mono'] font-bold ${index === activeIdx ? 'bg-primary-fixed text-on-primary-fixed' : visitedIds.includes(place.id?.toLowerCase()) ? 'bg-secondary text-on-secondary' : 'bg-secondary-container text-secondary'}`}>{visitedIds.includes(place.id?.toLowerCase()) ? '✓' : index + 1}</span>
              <span className="flex-1 min-w-0 font-['Stack_Sans_Headline'] font-semibold truncate">{getPlaceName(place)}</span>
              <span className="material-symbols-outlined text-[18px]">{index === activeIdx ? 'my_location' : 'chevron_right'}</span>
            </button>
          ))}
        </section>
      )}
    </div>
  );
};

export default RouteMap;
