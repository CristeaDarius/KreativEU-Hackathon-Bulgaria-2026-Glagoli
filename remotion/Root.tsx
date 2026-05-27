import {Composition} from 'remotion';
import {LocaiaPromo} from './LocaiaPromo';

export const RemotionRoot = () => {
  return (
    <Composition
      id="LocaiaPromo"
      component={LocaiaPromo}
      durationInFrames={1350}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
  );
};
