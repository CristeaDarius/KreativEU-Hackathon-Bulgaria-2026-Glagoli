import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {LogoLockup} from '../components/LogoLockup';
import {RouteLine} from '../components/RouteLine';
import {SceneBackground} from '../components/SceneBackground';
import styles from './PromoScenes.module.css';

export const OutroScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 25, stiffness: 80}});
  const line = interpolate(frame, [18, 76], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <SceneBackground texture={false}>
      <div className={styles.centerScene} style={{opacity: enter, transform: `translateY(${(1 - enter) * 26}px)`}}>
        <div>
          <LogoLockup />
          <RouteLine
            className={styles.outroLine}
            points={[{x: 0, y: 42}, {x: 165, y: 12}, {x: 330, y: 42}, {x: 520, y: 16}, {x: 700, y: 42}]}
            width={700}
            height={60}
            progress={line}
            strokeWidth={6}
          />
        </div>
      </div>
    </SceneBackground>
  );
};
