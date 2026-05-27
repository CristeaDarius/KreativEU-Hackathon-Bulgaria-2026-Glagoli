import styles from './RouteLine.module.css';

type Point = {x: number; y: number};

type RouteLineProps = {
  points: Point[];
  width: number;
  height: number;
  progress: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
};

const toPath = (points: Point[]) => {
  if (!points.length) return '';
  return points.reduce((path, point, index) => `${path}${index === 0 ? 'M' : ' L'} ${point.x} ${point.y}`, '');
};

export const RouteLine = ({points, width, height, progress, strokeWidth = 8, color, className}: RouteLineProps) => {
  const path = toPath(points);
  const dash = 2200;

  return (
    <svg className={`${styles.svg} ${className || ''}`} width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path className={styles.pathBase} d={path} strokeWidth={strokeWidth} />
      <path
        className={styles.pathProgress}
        d={path}
        strokeWidth={strokeWidth}
        style={{stroke: color, strokeDasharray: dash, strokeDashoffset: dash * (1 - Math.max(0, Math.min(1, progress)))}}
      />
    </svg>
  );
};
