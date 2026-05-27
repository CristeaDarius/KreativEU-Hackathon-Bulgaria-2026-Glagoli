import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import styles from './BadgeStamp.module.css';

type BadgeStampProps = {
  delay?: number;
};

export const BadgeStamp = ({delay = 0}: BadgeStampProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const stamp = spring({frame: frame - delay, fps, config: {damping: 12, stiffness: 120}});
  const opacity = interpolate(frame, [delay, delay + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <div className={styles.stamp} style={{opacity, scale: 0.82 + stamp * 0.18}}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Badge unlocked</p>
        <p className={styles.title}>Heritage Explorer</p>
        <p className={styles.meta}>1 of 6 collected</p>
      </div>
    </div>
  );
};
