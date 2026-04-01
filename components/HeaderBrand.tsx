import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { LineLogicGlyph } from '@/components/LineLogicGlyph';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const GLYPH_TAB = 18;
const GLYPH_STACK = 15;

type BrandProps = {
  /** Slightly smaller when shown beside the stack back button. */
  compact?: boolean;
};

/**
 * Top-left header: goalpost mark only. Tap → Home tab.
 */
export function HeaderBrand({ compact }: BrandProps) {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const w = compact ? GLYPH_STACK : GLYPH_TAB;
  const h = (w * 78) / 120;

  return (
    <Pressable
      onPress={() => router.push('/(tabs)')}
      style={styles.hit}
      accessibilityRole="button"
      accessibilityLabel="Line Logic, go to home">
      <View pointerEvents="none">
        <LineLogicGlyph color={c.text} width={w} height={h} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginLeft: 2,
    justifyContent: 'center',
  },
});
