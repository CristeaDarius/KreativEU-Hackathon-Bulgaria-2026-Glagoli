import {Img, staticFile} from 'remotion';
import styles from './LogoLockup.module.css';

type LogoLockupProps = {
  showTagline?: boolean;
  compact?: boolean;
};

export const LogoLockup = ({showTagline = true, compact = false}: LogoLockupProps) => {
  return (
    <div className={styles.lockup} style={compact ? {gap: 14} : undefined}>
      <div className={styles.mark} style={compact ? {width: 58, height: 58, borderRadius: 20} : undefined}>
        <Img src={staticFile('logoicon.svg')} />
      </div>
      <div className={styles.text}>
        <div className={styles.name} style={compact ? {fontSize: 48} : undefined}>LocAIa</div>
        {showTagline ? <div className={styles.tagline}>AI routes through local stories.</div> : null}
      </div>
    </div>
  );
};
