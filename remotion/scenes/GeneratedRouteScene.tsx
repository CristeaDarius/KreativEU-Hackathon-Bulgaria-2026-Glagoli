import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {PhoneFrame} from '../components/PhoneFrame';
import {SceneBackground} from '../components/SceneBackground';
import {TextReveal} from '../components/TextReveal';
import {routeStops} from '../data/routeData';
import styles from './PromoScenes.module.css';

export const GeneratedRouteScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <SceneBackground>
      <div className={styles.sceneGrid}>
        <TextReveal
          eyebrow="Generated route"
          title="Personalized routes with heritage, food, viewpoints, and hidden stories."
          body="A half-day plan becomes a calm route timeline tourists can understand instantly."
          delay={4}
        />
        <div className={styles.phoneArea}>
          <PhoneFrame delay={6}>
            <div className={styles.screen}>
              <div className={styles.statusBar}><span>09:42</span><span>AI route ready</span></div>
              <div className={styles.screenEyebrow}>Your half-day cultural route</div>
              <div className={styles.screenTitle}>Svishtov in 5 hours</div>
              <div className={styles.routeSummary}>
                <div className={styles.metric}>5 hours</div>
                <div className={styles.metric}>6 stops</div>
                <div className={styles.metric}>Audio-first</div>
              </div>
              <div className={styles.metric} style={{marginBottom: 16}}>Walking + optional transfer</div>
              <div className={styles.timeline}>
                {routeStops.map((stop, index) => {
                  const anim = spring({frame: frame - 24 - index * 8, fps, config: {damping: 22, stiffness: 120}});
                  return (
                    <div key={stop} className={styles.routeCard} style={{opacity: anim, transform: `translateY(${(1 - anim) * 32}px)`}}>
                      <span className={styles.stopNumber}>{index + 1}</span>
                      {stop}
                    </div>
                  );
                })}
              </div>
            </div>
          </PhoneFrame>
        </div>
      </div>
    </SceneBackground>
  );
};
