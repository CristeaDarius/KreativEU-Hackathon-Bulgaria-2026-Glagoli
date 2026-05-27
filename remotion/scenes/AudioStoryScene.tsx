import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {AudioWaveform} from '../components/AudioWaveform';
import {PhoneFrame} from '../components/PhoneFrame';
import {SceneBackground} from '../components/SceneBackground';
import {TextReveal} from '../components/TextReveal';
import styles from './PromoScenes.module.css';

export const AudioStoryScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pulse = spring({frame: frame % 30, fps, config: {damping: 8, stiffness: 80}});
  const progress = interpolate(frame, [36, 164], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <SceneBackground>
      <div className={styles.sceneGrid}>
        <TextReveal
          eyebrow="AI audio guide"
          title="Listen to AI audio stories at every stop."
          body="Stories adapt to pace and accessibility needs, like a museum audio guide for the city."
          delay={4}
        />
        <div className={styles.phoneArea}>
          <PhoneFrame delay={8}>
            <div className={styles.screen}>
              <div className={styles.statusBar}><span>09:56</span><span>Stop detail</span></div>
              <div className={styles.heroImage}>Aleko Konstantinov House-Museum</div>
              <div className={styles.screenEyebrow}>AI Audio Story</div>
              <div className={styles.detailCard}>
                <div className={styles.playerTop}>
                  <span>Listen to the story</span>
                  <div className={styles.playButton} style={{transform: `scale(${1 + pulse * 0.06})`}}>▶</div>
                </div>
                <AudioWaveform progress={progress} />
                <div className={styles.progressTrack}><div className={styles.progressFill} style={{width: `${progress * 100}%`}} /></div>
              </div>
              <div className={styles.actionList}>
                <div className={styles.smallAction}>Read shorter version</div>
                <div className={styles.smallAction}>Ask AI Guide</div>
                <div className={styles.smallAction} style={{gridColumn: '1 / -1', background: '#123C46', color: 'white'}}>Mark as visited</div>
              </div>
            </div>
          </PhoneFrame>
        </div>
      </div>
    </SceneBackground>
  );
};
