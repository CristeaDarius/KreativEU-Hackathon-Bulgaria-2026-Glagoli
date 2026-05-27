import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {PhoneFrame} from '../components/PhoneFrame';
import {SceneBackground} from '../components/SceneBackground';
import {TextReveal} from '../components/TextReveal';
import styles from './PromoScenes.module.css';

const people = ['Cultural tourist', 'Family', 'Visually impaired visitor'];
const prefs = ['History', 'Local food', 'Relaxed route', 'Hidden places'];

export const QuestionnaireScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <SceneBackground>
      <div className={styles.sceneGrid}>
        <TextReveal
          eyebrow="Profile builder"
          title="Answer a few questions."
          body="LocAIa builds your route profile around pace, interests, group needs, and accessibility."
          delay={4}
        />
        <div className={styles.phoneArea}>
          <PhoneFrame delay={8}>
            <div className={styles.screen}>
              <div className={styles.statusBar}><span>09:41</span><span>Svishtov</span></div>
              <div className={styles.screenEyebrow}>Build your route</div>
              <div className={styles.screenTitle}>Who are you?</div>
              <div className={styles.cardGrid}>
                {people.map((item, index) => {
                  const anim = spring({frame: frame - 22 - index * 7, fps, config: {damping: 22, stiffness: 120}});
                  return (
                    <div key={item} className={`${styles.choiceCard} ${index < 2 ? styles.selected : ''}`} style={{opacity: anim, transform: `translateY(${(1 - anim) * 20}px)`}}>
                      {item}
                    </div>
                  );
                })}
              </div>
              <div className={styles.questionBlock}>
                <div className={styles.screenTitle} style={{fontSize: 27}}>What do you prefer?</div>
                <div className={styles.chips}>
                  {prefs.map((item, index) => {
                    const opacity = interpolate(frame, [58 + index * 6, 70 + index * 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
                    return <div key={item} className={`${styles.chip} ${index !== 2 ? styles.chipSelected : ''}`} style={{opacity}}>{item}</div>;
                  })}
                </div>
              </div>
              <div className={styles.primaryButton}>Generate AI route</div>
              <div className={styles.buildState} style={{opacity: interpolate(frame, [124, 146], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>Profile building...</div>
            </div>
          </PhoneFrame>
        </div>
      </div>
    </SceneBackground>
  );
};
