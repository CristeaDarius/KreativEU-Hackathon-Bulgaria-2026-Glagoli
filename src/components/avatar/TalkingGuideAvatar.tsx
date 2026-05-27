import React, { useEffect, useMemo, useState } from 'react';
import { createAvatarProvider } from './avatar.provider';
import type { TalkingGuideAvatarProps } from './avatar.types';
import styles from './TalkingGuideAvatar.module.css';

const labels = {
  idle: 'AI local guide',
  listening: 'Listening...',
  thinking: 'Building your route...',
  speaking: 'AI Guide is speaking',
  success: 'Route profile updated',
  error: 'Guide unavailable',
};

const stateClass = {
  idle: '',
  listening: styles.listening,
  thinking: styles.thinking,
  speaking: styles.speaking,
  success: styles.success,
  error: styles.error,
};

export const TalkingGuideAvatar = ({
  state = 'idle',
  message,
  size = 'md',
  imageSrc = '/historical-guide-avatar.svg',
  videoSources,
  onReady,
  onError,
}: TalkingGuideAvatarProps) => {
  const [videoFailed, setVideoFailed] = useState(false);
  const provider = useMemo(() => createAvatarProvider(videoSources), [videoSources]);
  const providerState = provider.getState(state);
  const showVideo = providerState.hasVideo && providerState.source && !videoFailed;
  const label = message || labels[state];

  useEffect(() => {
    setVideoFailed(false);
  }, [providerState.source]);

  return (
    <section
      className={`${styles.card} ${styles[size]}`}
      aria-label={`LocAIa guide avatar status: ${labels[state]}`}
    >
      <div className={`${styles.stage} ${styles.breath} ${stateClass[state]}`}>
        {showVideo ? (
          <video
            key={providerState.source}
            className={styles.video}
            src={providerState.source}
            muted
            autoPlay
            loop
            playsInline
            preload="metadata"
            onCanPlay={onReady}
            onError={() => {
              setVideoFailed(true);
              onError?.(new Error(`Avatar media failed to load: ${providerState.source}`));
            }}
          />
        ) : (
          <div className={styles.fallback} aria-hidden="true">
            <div className={styles.routeLine} />
            <img className={styles.portrait} src={imageSrc} alt="" loading="lazy" />
            <div className={styles.mouth} />
            {state === 'thinking' && (
              <>
                <span className={styles.thinkingDot} />
                <span className={styles.thinkingDot} />
                <span className={styles.thinkingDot} />
              </>
            )}
            {state === 'speaking' && (
              <div className={styles.waveform}>
                <span />
                <span />
                <span />
                <span />
              </div>
            )}
            {state === 'success' && <div className={styles.successBadge}>✓</div>}
            {state === 'error' && <div className={styles.errorBadge}>!</div>}
          </div>
        )}
        <span className={styles.listeningRing} />
        <span className={styles.accentRing} />
      </div>

      <div className={styles.content}>
        <span className={styles.eyebrow}>LocAIa Guide</span>
        <span className={styles.label}>{labels[state]}</span>
        <span className={styles.message}>{label}</span>
      </div>
    </section>
  );
};

export default TalkingGuideAvatar;
