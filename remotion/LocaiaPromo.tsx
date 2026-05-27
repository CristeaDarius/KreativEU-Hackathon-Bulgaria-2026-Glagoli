import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {AudioStoryScene} from './scenes/AudioStoryScene';
import {BadgesCompendiumScene} from './scenes/BadgesCompendiumScene';
import {GeneratedRouteScene} from './scenes/GeneratedRouteScene';
import {IntroHook} from './scenes/IntroHook';
import {OpenMapScene} from './scenes/OpenMapScene';
import {OutroScene} from './scenes/OutroScene';
import {ProductReveal} from './scenes/ProductReveal';
import {QuestionnaireScene} from './scenes/QuestionnaireScene';
import {captions} from './data/routeData';
import styles from './scenes/PromoScenes.module.css';

const scenes = [
  {from: 0, duration: 150, component: IntroHook},
  {from: 150, duration: 150, component: ProductReveal},
  {from: 300, duration: 210, component: QuestionnaireScene},
  {from: 510, duration: 210, component: GeneratedRouteScene},
  {from: 720, duration: 210, component: OpenMapScene},
  {from: 930, duration: 180, component: AudioStoryScene},
  {from: 1110, duration: 150, component: BadgesCompendiumScene},
  {from: 1260, duration: 90, component: OutroScene},
];

const SceneLayer = ({duration, children}: {duration: number; children: React.ReactNode}) => {
  const frame = useCurrentFrame();
  const opacity = Math.min(
    interpolate(frame, [0, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    interpolate(frame, [duration - 12, duration], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
  );

  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

const CaptionOverlay = () => {
  const frame = useCurrentFrame();
  const active = captions.find((caption) => frame >= caption.start && frame < caption.end);
  if (!active) return null;

  const opacity = Math.min(
    interpolate(frame, [active.start, active.start + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    interpolate(frame, [active.end - 10, active.end], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
  );

  return <div className={styles.caption} style={{opacity}}>{active.text}</div>;
};

export const LocaiaPromo = () => {
  return (
    <AbsoluteFill className="remotion-root">
      {scenes.map((scene) => {
        const Scene = scene.component;
        return (
          <Sequence key={scene.from} from={scene.from} durationInFrames={scene.duration}>
            <SceneLayer duration={scene.duration}>
              <Scene />
            </SceneLayer>
          </Sequence>
        );
      })}
      <CaptionOverlay />
    </AbsoluteFill>
  );
};
