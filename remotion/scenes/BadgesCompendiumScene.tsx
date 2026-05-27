import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BadgeStamp} from '../components/BadgeStamp';
import {SceneBackground} from '../components/SceneBackground';
import {TextReveal} from '../components/TextReveal';
import styles from './PromoScenes.module.css';

export const BadgesCompendiumScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cards = spring({frame: frame - 48, fps, config: {damping: 25, stiffness: 95}});

  return (
    <SceneBackground>
      <div className={styles.sceneGrid}>
        <TextReveal
          eyebrow="Compendium"
          title="Collect places. Unlock memories. Preserve heritage."
          body="A route becomes a personal cultural record visitors can keep after the trip."
          delay={4}
        />
        <div className={styles.badgeSceneCards}>
          <BadgeStamp delay={22} />
          <div className={styles.compendium} style={{opacity: cards, transform: `translateX(${(1 - cards) * 48}px)`}}>
            <h2 className={styles.compendiumTitle}>Your Svishtov Compendium</h2>
            <p className={styles.compendiumText}>Collected places, stories, and badges from your route.</p>
            <div className={styles.compendiumCard}>Aleko Konstantinov House-Museum</div>
            <div className={styles.compendiumCard}>Holy Trinity Church</div>
            <div className={styles.compendiumCard}>Heritage Explorer badge</div>
          </div>
        </div>
      </div>
    </SceneBackground>
  );
};
