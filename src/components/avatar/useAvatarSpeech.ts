import { useCallback, useEffect, useRef, useState } from 'react';

type UseAvatarSpeechOptions = {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
};

export const useAvatarSpeech = ({ onStart, onEnd, onError }: UseAvatarSpeechOptions = {}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string>('');
  const [isSupported, setIsSupported] = useState(
    () => typeof window !== 'undefined' && Boolean(window.speechSynthesis) && typeof SpeechSynthesisUtterance !== 'undefined'
  );
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const stoppingRef = useRef(false);
  const callbacksRef = useRef<UseAvatarSpeechOptions>({ onStart, onEnd, onError });

  useEffect(() => {
    callbacksRef.current = { onStart, onEnd, onError };
  }, [onEnd, onError, onStart]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };

    loadVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', loadVoices);
  }, []);

  const getVoice = useCallback(() => {
    const voices = voicesRef.current.length ? voicesRef.current : window.speechSynthesis.getVoices();
    voicesRef.current = voices;

    return (
      voices.find(voice => voice.lang?.toLowerCase().startsWith('en') && voice.localService) ||
      voices.find(voice => voice.lang?.toLowerCase().startsWith('en')) ||
      voices[0]
    );
  }, []);

  const chunkText = useCallback((text: string) => {
    const clean = text.replace(/\s+/g, ' ').trim();
    if (clean.length <= 180) return [clean];

    const sentences = clean.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [clean];
    const chunks: string[] = [];
    let current = '';

    sentences.forEach(sentence => {
      const next = `${current} ${sentence}`.trim();
      if (next.length > 180 && current) {
        chunks.push(current);
        current = sentence.trim();
      } else {
        current = next;
      }
    });

    if (current) chunks.push(current);
    return chunks;
  }, []);

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    stoppingRef.current = true;
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setIsSpeaking(false);
    setError('');
    window.setTimeout(() => {
      stoppingRef.current = false;
    }, 0);
  }, []);

  const speak = useCallback((text: string) => {
    const chunks = chunkText(text);
    if (!chunks.length || !chunks[0]) return;

    if (typeof window === 'undefined' || !window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') {
      const speechError = new Error('Speech synthesis is not available in this browser.');
      setError(speechError.message);
      callbacksRef.current.onError?.(speechError);
      return;
    }

    stoppingRef.current = false;
    setError('');
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    const voice = getVoice();
    let index = 0;

    const speakChunk = () => {
      const utterance = new SpeechSynthesisUtterance(chunks[index]);
      if (voice) utterance.voice = voice;
      utterance.lang = voice?.lang || 'en-US';
      utterance.rate = 0.94;
      utterance.pitch = 0.9;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
        if (index === 0) callbacksRef.current.onStart?.();
      };

      utterance.onend = () => {
        if (stoppingRef.current) return;

        index += 1;
        if (index < chunks.length) {
          speakChunk();
          return;
        }

        utteranceRef.current = null;
        setIsSpeaking(false);
        callbacksRef.current.onEnd?.();
      };

      utterance.onerror = (event) => {
        if (stoppingRef.current || event.error === 'interrupted' || event.error === 'canceled') return;

        const speechError = new Error(`Speech synthesis failed: ${event.error || 'unknown error'}`);
        utteranceRef.current = null;
        setIsSpeaking(false);
        setError(speechError.message);
        callbacksRef.current.onError?.(speechError);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      window.setTimeout(() => window.speechSynthesis.resume(), 60);
    };

    setIsSpeaking(true);
    speakChunk();
  }, [chunkText, getVoice]);

  return { speak, stop, isSpeaking, isSupported, error };
};
