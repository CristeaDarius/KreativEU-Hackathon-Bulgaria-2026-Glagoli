import {interpolate, useCurrentFrame} from 'remotion';
import {MapPin} from '../components/MapPin';
import {RouteLine} from '../components/RouteLine';
import {SceneBackground} from '../components/SceneBackground';
import {TextReveal} from '../components/TextReveal';
import styles from './PromoScenes.module.css';

const points = [
  {x: 40, y: 220},
  {x: 330, y: 145},
  {x: 580, y: 252},
  {x: 850, y: 172},
  {x: 1130, y: 270},
  {x: 1420, y: 156},
];

export const IntroHook = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [8, 118], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <SceneBackground>
      <div className={styles.centerScene}>
        <RouteLine className={styles.hookLine} points={points} width={1500} height={430} progress={progress} strokeWidth={7} />
        <MapPin x={260} y={465} label="1" delay={38} />
        <MapPin x={825} y={562} label="2" delay={62} />
        <MapPin x={1350} y={452} label="3" delay={86} />
        <TextReveal title="Every city has stories tourists never hear." delay={18} className={styles.headlineLarge} />
      </div>
    </SceneBackground>
  );
};
