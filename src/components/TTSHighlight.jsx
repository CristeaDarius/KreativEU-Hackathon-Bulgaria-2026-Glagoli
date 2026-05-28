import React from 'react';
import { useNarration } from '../context/NarrationContext';

// Wrap any text element with this to show a yellow highlight when it's being read.
// Usage: <TTSHighlight ttsKey="login.start">{t('login.start')}</TTSHighlight>

const TTSHighlight = ({ ttsKey, children, className = '' }) => {
  const { activeKey } = useNarration();
  const isActive = activeKey === ttsKey;

  return (
    <span className={`relative inline-block ${className}`} data-tts-key={ttsKey}>
      {isActive && (
        <span
          className="absolute inset-0 rounded-full pointer-events-none animate-pulse"
          style={{ background: 'rgba(255, 220, 0, 0.65)', margin: '-16px -32px' }}
        />
      )}
      {children}
    </span>
  );
};

export default TTSHighlight;
