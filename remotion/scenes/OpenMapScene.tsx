import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {MapPin} from '../components/MapPin';
import {PhoneFrame} from '../components/PhoneFrame';
import {RouteLine} from '../components/RouteLine';
import {SceneBackground} from '../components/SceneBackground';
import {TextReveal} from '../components/TextReveal';
import styles from './PromoScenes.module.css';

const mapPoints = [
  {x: 82, y: 168},
  {x: 190, y: 260},
  {x: 294, y: 230},
  {x: 230, y: 382},
  {x: 330, y: 480},
  {x: 158, y: 548},
];

export const OpenMapScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const line = interpolate(frame, [22, 132], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sheet = spring({frame: frame - 86, fps, config: {damping: 24, stiffness: 100}});

  return (
    <SceneBackground>
      <div className={styles.sceneGrid}>
        <TextReveal
          eyebrow="Open map"
          title="Follow the route on an open cultural map."
          body="Numbered stops, accessible mode, and a bottom sheet focused on the next action."
          delay={4}
        />
        <div className={styles.phoneArea}>
          <PhoneFrame delay={6}>
            <div className={styles.mapScreen}>
              <div className={styles.river} />
              <RouteLine points={mapPoints} width={430} height={650} progress={line} strokeWidth={7} />
              {mapPoints.map((point, index) => (
                <MapPin key={index} x={point.x - 15} y={point.y - 15} label={index + 1} delay={28 + index * 10} small color={index === 0 ? '#B66A3C' : '#123C46'} />
              ))}
              <div className={styles.bottomSheet} style={{transform: `translateY(${(1 - sheet) * 180}px)`, opacity: sheet}}>
                <div className={styles.sheetMeta}>Stop 1 of 6</div>
                <div className={styles.sheetTitle}>Aleko Konstantinov House-Museum</div>
                <div className={styles.sheetActions}>
                  <div className={styles.sheetButton}>Open stop</div>
                  <div className={`${styles.sheetButton} ${styles.sheetButtonAlt}`}>Next stop</div>
                </div>
                <div className={styles.accessibility}>Accessible Mode</div>
              </div>
            </div>
          </PhoneFrame>
        </div>
      </div>
    </SceneBackground>
  );
};
