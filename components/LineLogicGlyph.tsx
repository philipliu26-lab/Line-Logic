import Svg, { Rect } from 'react-native-svg';

type Props = {
  /** Primary UI color — matches headlines so the mark sits in the interface. */
  color: string;
  width: number;
  height: number;
};

/**
 * Vector L–T–L “goalposts” mark (no plate, no PNG white box). Geometry matches the
 * Line Logic wordmark: mirrored L’s with a T centered between them.
 */
export function LineLogicGlyph({ color, width, height }: Props) {
  return (
    <Svg width={width} height={height} viewBox="0 0 120 78">
      {/* Left goalpost (L) */}
      <Rect x={8} y={6} width={12} height={46} rx={1} fill={color} />
      <Rect x={8} y={50} width={34} height={12} rx={1} fill={color} />
      {/* Right goalpost (L) */}
      <Rect x={100} y={6} width={12} height={46} rx={1} fill={color} />
      <Rect x={78} y={50} width={34} height={12} rx={1} fill={color} />
      {/* T — crossbar sits between the posts; stem drops past the L crossbars */}
      <Rect x={42} y={14} width={36} height={11} rx={1} fill={color} />
      <Rect x={54} y={25} width={12} height={47} rx={1} fill={color} />
    </Svg>
  );
}
