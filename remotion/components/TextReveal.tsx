import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import styles from './TextReveal.module.css';

type TextRevealProps = {
  eyebrow?: string;
  title: string;
  body?: string;
  delay?: number;
  className?: string;
};

export const TextReveal = ({eyebrow, title, body, delay = 0, className}: TextRevealProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = spring({frame: frame - delay, fps, config: {damping: 28, stiffness: 110}});
  const opacity = interpolate(frame, [delay, delay + 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const transform = `translateY(${interpolate(progress, [0, 1], [34, 0])}px)`;

  return (
    <div className={`${styles.wrap} ${className || ''}`} style={{opacity, transform}}>
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <h1 className={styles.title}>{title}</h1>
      {body ? <p className={styles.body}>{body}</p> : null}
    </div>
  );
};
