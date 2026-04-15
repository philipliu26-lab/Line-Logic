import { StyleSheet, View as RNView } from 'react-native';

import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export function DisclaimerBanner() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  return (
    <RNView
      style={[styles.wrap, { backgroundColor: c.muted + '18', borderColor: c.border }]}
      accessibilityRole="text"
      accessibilityLabel="Disclaimer: educational prototype, not gambling advice.">
      <Text style={[styles.text, { color: c.textSecondary }]}>
        Educational prototype — not gambling or financial advice. Featured matchups, lines, and times are
        illustrative for class demonstration.
      </Text>
    </RNView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  text: {
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
  },
});
