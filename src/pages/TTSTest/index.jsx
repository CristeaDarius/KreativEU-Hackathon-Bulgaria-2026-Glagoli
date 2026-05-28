import React, { useState } from 'react';
import useTTS from '../../hooks/useTTS';

const VOICES = [
  { id: 'EXAVITQu4vr4xnSDxMaL', label: 'Sarah', desc: 'Mature, reassuring, confident ★' },
  { id: 'FGY2WhTYpPnrIDTdsKH5', label: 'Laura', desc: 'Enthusiastic, quirky' },
  { id: 'Xb7hH8MSUJpSbSDYk0k2', label: 'Alice', desc: 'Clear, engaging educator' },
  { id: 'XrExE9yKIg1WjnnlVkGX', label: 'Matilda', desc: 'Knowledgeable, professional' },
  { id: 'cgSgspJ2msm6clMCkdW9', label: 'Jessica', desc: 'Playful, bright, warm' },
  { id: 'pFZP5JQG7iQjIQuC4Bku', label: 'Lily', desc: 'Velvety actress' },
];

const TTSTest = () => {
  const [text, setText] = useState('');
  const [voiceId, setVoiceId] = useState(VOICES[0].id);
  const [audioUrl, setAudioUrl] = useState(null);
  const { speak, stop, loading } = useTTS();

  const selectedVoice = VOICES.find(v => v.id === voiceId);

  const handleSpeak = async () => {
    setAudioUrl(null);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        new Audio(url).play();
        return;
      }
    } catch (e) {
      console.error('TTS error:', e);
    }
    speak(text, voiceId);
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `tts_${selectedVoice?.label}_${Date.now()}.mp3`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-5 gap-6 font-['Manrope']">
      <h1 className="text-[28px] font-['Montserrat'] font-bold text-primary">TTS Test</h1>
      <p className="font-['IBM_Plex_Mono'] text-[12px] text-on-surface-variant">ElevenLabs · eleven_multilingual_v2</p>

      <div className="w-full max-w-lg flex flex-col gap-2">
        <label className="font-['IBM_Plex_Mono'] text-[12px] text-on-surface-variant uppercase tracking-wide">Voice</label>
        <div className="grid grid-cols-2 gap-2">
          {VOICES.map(v => (
            <button key={v.id} onClick={() => { setVoiceId(v.id); setAudioUrl(null); }}
              className={`p-3 rounded-xl border text-left transition-all ${
                voiceId === v.id
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-container-lowest border-outline-variant text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <span className="font-['IBM_Plex_Mono'] text-[13px] font-medium block">{v.label}</span>
              <span className="font-['Manrope'] text-[12px] mt-0.5 opacity-80 block">{v.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type something to speak..."
        rows={5}
        className="w-full max-w-lg border border-outline-variant rounded-xl p-4 text-[16px] bg-surface-container-lowest resize-none focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <div className="flex gap-3 w-full max-w-lg">
        <button onClick={handleSpeak} disabled={loading || !text.trim()}
          className="flex-1 bg-primary text-on-primary py-3 rounded-xl font-['IBM_Plex_Mono'] text-[14px] disabled:opacity-50 active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">{loading ? 'hourglass_empty' : 'volume_up'}</span>
          {loading ? 'Speaking...' : `Speak as ${selectedVoice?.label}`}
        </button>
        <button onClick={stop}
          className="px-4 bg-surface border border-outline-variant text-on-surface py-3 rounded-xl font-['IBM_Plex_Mono'] text-[14px] active:scale-95 transition-transform"
        >Stop</button>
        {audioUrl && (
          <button onClick={handleDownload}
            className="px-4 bg-surface-container border border-outline-variant text-on-surface py-3 rounded-xl font-['IBM_Plex_Mono'] text-[14px] active:scale-95 transition-transform flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TTSTest;
