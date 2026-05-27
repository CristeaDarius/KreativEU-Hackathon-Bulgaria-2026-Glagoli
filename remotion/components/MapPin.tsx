import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import styles from './MapPin.module.css';

type MapPinProps = {
  x: number;
  y: number;
  label: string | number;
  delay?: number;
  small?: boolean;
  color?: string;
};

export const MapPin = ({x, y, label, delay = 0, small = false, color}: MapPinProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = spring({frame: frame - delay, fps, config: {damping: 16, stiffness: 140}});
  const opacity = interpolate(frame, [delay, delay + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <div
      className={`${styles.pin} ${small ? styles.small : ''}`}
      style={{left: x, top: y, opacity, scale, background: color}}
    >
      <span>{label}</span>
    </div>
  );
};
