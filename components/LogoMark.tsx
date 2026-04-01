import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { LineLogicGlyph } from '@/components/LineLogicGlyph';

type Props = {
  variant?: 'onboarding' | 'home';
  style?: StyleProp<ViewStyle>;
};

/**
 * Goalpost mark only — vector, no white plate; uses theme text color to blend with the screen.
 */
export function LogoMark({ variant = 'home', style }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const isOnboarding = variant === 'onboarding';

  const w = isOnboarding ? 220 : 186;
  const h = (w * 78) / 120;

  return (
    <View
      style={[styles.wrap, isOnboarding && styles.wrapCenter, style]}
      accessible
      accessibilityRole="image"
      accessibilityLabel="Line Logic">
      <LineLogicGlyph color={c.text} width={w} height={h} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
  },
  wrapCenter: {
    alignSelf: 'center',
  },
});
