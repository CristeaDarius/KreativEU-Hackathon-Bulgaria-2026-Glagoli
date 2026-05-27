import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {LogoLockup} from '../components/LogoLockup';
import {RouteLine} from '../components/RouteLine';
import {SceneBackground} from '../components/SceneBackground';
import styles from './PromoScenes.module.css';

export const ProductReveal = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 25, stiffness: 80}});
  const line = interpolate(frame, [16, 116], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <SceneBackground>
      <div className={styles.centerScene}>
        <div className={styles.productHalo} style={{opacity: enter * 0.75, transform: `scale(${0.94 + enter * 0.06})`}} />
        <RouteLine
          points={[{x: 40, y: 210}, {x: 280, y: 120}, {x: 520, y: 238}, {x: 760, y: 160}, {x: 980, y: 230}]}
          width={1020}
          height={360}
          progress={line}
          strokeWidth={6}
        />
        <div style={{opacity: enter, transform: `translateY(${(1 - enter) * 30}px)`}}>
          <LogoLockup />
          <p style={{margin: '42px auto 0', maxWidth: 900, fontSize: 36, lineHeight: 1.25, color: 'rgba(23,32,38,0.76)', fontWeight: 720}}>
            LocAIa turns local memory into AI-guided cultural routes.
          </p>
          <p style={{margin: '16px auto 0', color: '#2F6F7E', fontSize: 27, fontWeight: 760}}>
            Built for tourists, families, and accessible exploration.
          </p>
        </div>
      </div>
    </SceneBackground>
  );
};
