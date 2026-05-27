import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import styles from './PhoneFrame.module.css';

type PhoneFrameProps = {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
};

export const PhoneFrame = ({children, delay = 0, style}: PhoneFrameProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - delay, fps, config: {damping: 24, stiffness: 90}});

  return (
    <div className={styles.phone} style={{...style, opacity: enter, transform: `translateY(${(1 - enter) * 42}px) scale(${0.96 + enter * 0.04})`}}>
      <div className={styles.notch} />
      <div className={styles.screen}>{children}</div>
    </div>
  );
};
