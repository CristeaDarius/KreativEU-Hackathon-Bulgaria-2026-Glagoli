import { useRef, useState } from 'react';

const useTTS = () => {
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);

  const speak = async (text, voiceId) => {
    if (!text) return;
    stop();
    setLoading(true);

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => { URL.revokeObjectURL(url); setLoading(false); };
        audio.onerror = () => setLoading(false);
        audio.play();
        return;
      } else {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        console.error('TTS API error:', res.status, err);
      }
    } catch (e) {
      console.error('TTS fetch error:', e);
    }

    // Fallback: Web Speech API
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const female = voices.find(v => /female|woman|zira|samantha|karen|moira|fiona|victoria/i.test(v.name));
      if (female) utterance.voice = female;
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.onend = () => setLoading(false);
      window.speechSynthesis.speak(utterance);
    }

    setLoading(false);
  };

  const stop = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  return { speak, stop, loading };
};

export default useTTS;
