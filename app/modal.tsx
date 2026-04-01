import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, View as RNView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function ModalScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <DisclaimerBanner />
        <Text style={[styles.title, { color: c.text }]}>About Line Logic</Text>
        <Text style={[styles.body, { color: c.textSecondary }]}>
          Line Logic is an MVP template for a mobile product that nudges bettors away from purely
          emotional decisions and toward transparent, data-backed reasoning—odds comparison, line
          movement, and tiered AI picks with clear limits that match your subscription.
        </Text>
        <Text style={[styles.body, { color: c.textSecondary }]}>
          Nothing in this build connects to real sportsbooks or models; it is a visual and
          structural shell you can extend with auth, payments, and live data when you are ready.
        </Text>
        <RNView style={[styles.tag, { borderColor: c.border, backgroundColor: c.surface }]}>
          <Text style={[styles.tagText, { color: c.muted }]}>Expo Router · React Native</Text>
        </RNView>
      </ScrollView>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 14 },
  body: { fontSize: 15, lineHeight: 24, marginBottom: 14 },
  tag: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 8,
  },
  tagText: { fontSize: 12, fontWeight: '600' },
});
