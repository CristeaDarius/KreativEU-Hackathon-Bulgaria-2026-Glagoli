import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNarration } from '../../context/NarrationContext';
import { fetchPlace, fetchPlaces, getPlaceName } from '../../lib/api';
import TTSHighlight from '../../components/TTSHighlight';

const Concierge = () => {
  const { state } = useLocation();
  const { t } = useTranslation();
  const { setNarrationKeys } = useNarration();
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [loadingPlace, setLoadingPlace] = useState(false);
  const [loadingReply, setLoadingReply] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setNarrationKeys([]);
    setLoadingPlaces(true);
    fetchPlaces()
      .then(data => {
        setPlaces(data);
        const preferred = state?.placeId || data[0]?.id;
        if (preferred) loadPlace(preferred);
      })
      .catch(() => setError(t('concierge.error_places')))
      .finally(() => setLoadingPlaces(false));
  }, [state?.placeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loadingReply]);

  const loadPlace = async (id) => {
    setError('');
    setLoadingPlace(true);
    try {
      const data = await fetchPlace(id);
      setSelectedPlace(data);
      setMessages([
        { role: 'assistant', content: t('concierge.welcome') },
        { role: 'assistant', content: t('concierge.ready', { place: getPlaceName(data) }) },
      ]);
    } catch {
      setError(t('concierge.error_place'));
    } finally {
      setLoadingPlace(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedPlace || loadingReply) return;

    const systemMessage = {
      role: 'system',
      content: `You are a guide for "${getPlaceName(selectedPlace)}". You may ONLY answer using the information in the description below. Do not use any outside knowledge, do not make assumptions, and do not invent details. If the answer is not in the description, say "I don't have that information."\n\nDescription:\n${typeof selectedPlace.description === 'object' ? Object.entries(selectedPlace.description).filter(([k]) => k !== 'sources').map(([k,v]) => `${k}: ${v}`).join('\n\n') : selectedPlace.description || selectedPlace.additional_info || ''}`,
    };

    const userMessage = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoadingReply(true);
    setError('');

    try {
      if (!import.meta.env.VITE_MISTRAL_API_KEY) throw new Error('Missing Mistral API key');

      const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: import.meta.env.VITE_MISTRAL_MODEL || 'ministral-8b-latest',
          messages: [systemMessage, ...updatedMessages.filter(message => message.role !== 'assistant' || message !== welcomeMessage)],
        }),
      });

      if (!res.ok) throw new Error('Unable to contact guide');
      const data = await res.json();
      const reply = data.choices?.[0]?.message;
      setMessages(reply ? [...updatedMessages, reply] : [...updatedMessages, { role: 'assistant', content: t('route_map.ai_error') }]);
    } catch {
      setError(t('concierge.error_ai'));
    } finally {
      setLoadingReply(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-full flex flex-col px-5 pt-4 gap-4">
      <section className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar -mx-5 px-5">
        {loadingPlaces && <span className="rounded-full bg-surface-container px-4 py-2 font-['IBM_Plex_Mono'] text-[12px] text-on-surface-variant"><TTSHighlight ttsKey="home.loading">{t('home.loading')}</TTSHighlight></span>}
        {!loadingPlaces && places.length === 0 && <span className="rounded-full bg-surface-container px-4 py-2 font-['IBM_Plex_Mono'] text-[12px] text-on-surface-variant"><TTSHighlight ttsKey="concierge.no_places">{t('concierge.no_places')}</TTSHighlight></span>}
        {places.map(place => {
          const active = selectedPlace?.id?.toLowerCase() === place.id.toLowerCase();
          return (
            <button
              type="button"
              key={place.id}
              onClick={() => loadPlace(place.id)}
              disabled={loadingPlace}
              className={`shrink-0 rounded-full border px-4 py-2 font-['IBM_Plex_Mono'] text-[12px] transition-colors ${active ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant'}`}
            >
              {getPlaceName(place)}
            </button>
          );
        })}
      </section>

      {selectedPlace && (
        <section className="rounded-[24px] bg-surface-container-lowest border border-outline-variant p-4 shadow-sm">
          <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-outline"><TTSHighlight ttsKey="concierge.current_story">{t('concierge.current_story')}</TTSHighlight></span>
          <h1 className="text-[22px] leading-7 font-['Stack_Sans_Headline'] font-semibold text-primary mt-1">{getPlaceName(selectedPlace)}</h1>
        </section>
      )}

      {error && <div className="rounded-2xl bg-error-container text-on-error-container p-4 text-[14px]">{error}</div>}

      <section className="flex-1 flex flex-col gap-3 pb-2">
        {messages.map((message, index) => {
          const isUser = message.role === 'user';
          return (
            <div key={`${message.role}-${index}`} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[84%] rounded-[22px] px-4 py-3 text-[15px] leading-6 shadow-sm ${isUser ? 'bg-primary text-on-primary rounded-br-md' : 'bg-surface-container-lowest border border-outline-variant text-on-surface rounded-bl-md'}`}>
                {message.content}
              </div>
            </div>
          );
        })}
        {loadingReply && (
          <div className="flex justify-start">
            <div className="rounded-[22px] rounded-bl-md bg-surface-container-lowest border border-outline-variant px-4 py-3 text-on-surface-variant"><TTSHighlight ttsKey="concierge.thinking">{t('concierge.thinking')}</TTSHighlight></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </section>

      <section className="sticky bottom-0 -mx-5 px-5 pt-3 pb-4 bg-background/95 backdrop-blur border-t border-outline-variant">
        <div className="app-control flex items-end gap-2 p-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedPlace ? t('concierge.placeholder', { place: getPlaceName(selectedPlace) }) : t('concierge.no_places')}
            rows={1}
            className="app-textarea flex-1 resize-none outline-none px-3 py-3 text-[15px] max-h-28"
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={!input.trim() || !selectedPlace || loadingReply}
            className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center disabled:opacity-40 active:scale-95 transition-transform"
            aria-label="Send message"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Concierge;
