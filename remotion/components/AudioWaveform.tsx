import {interpolate, useCurrentFrame} from 'remotion';
import styles from './AudioWaveform.module.css';

const heights = [18, 36, 52, 28, 64, 42, 22, 58, 46, 30, 66, 38, 24, 54, 34, 48, 26, 60];

type AudioWaveformProps = {
  progress?: number;
};

export const AudioWaveform = ({progress = 1}: AudioWaveformProps) => {
  const frame = useCurrentFrame();

  return (
    <div className={styles.wave}>
      {heights.map((height, index) => {
        const active = interpolate(progress, [0, 1], [0, heights.length - 1]) >= index;
        const pulse = Math.sin((frame + index * 5) / 8) * 0.18 + 1;
        return (
          <div
            key={`${height}-${index}`}
            className={styles.bar}
            style={{height: height * pulse, opacity: active ? 1 : 0.24, background: active ? undefined : '#C9D5D0'}}
          />
        );
      })}
    </div>
  );
};
