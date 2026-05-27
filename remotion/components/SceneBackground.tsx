import {AbsoluteFill} from 'remotion';
import styles from './SceneBackground.module.css';

type SceneBackgroundProps = {
  children: React.ReactNode;
  texture?: boolean;
};

export const SceneBackground = ({children, texture = true}: SceneBackgroundProps) => {
  return (
    <AbsoluteFill className={styles.background}>
      {texture ? <div className={styles.mapTexture} /> : null}
      <div className={styles.content}>{children}</div>
    </AbsoluteFill>
  );
};
