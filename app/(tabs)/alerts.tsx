import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View as RNView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { Text } from '@/components/Themed';
import { useApp } from '@/context/AppContext';
import { MOCK_ALERTS } from '@/data/alerts';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function AlertsScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const { tier } = useApp();
  const showRealtime = tier === 'pro' || tier === 'elite';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <DisclaimerBanner />

        {!showRealtime ? (
          <RNView style={[styles.gate, { backgroundColor: c.surface, borderColor: c.border }]}>
            <FontAwesome name="bell-slash" size={24} color={c.muted} />
            <Text style={[styles.gateTitle, { color: c.text }]}>Real-time line alerts</Text>
            <Text style={[styles.gateBody, { color: c.textSecondary }]}>
              Base includes email alerts as a placeholder in Account. Pro and Elite unlock this in-app
              alert feed with mock steam events for your demo.
            </Text>
            <Pressable
              onPress={() => router.push('/(tabs)/plans')}
              style={[styles.cta, { borderColor: c.accent }]}
              accessibilityRole="button"
              accessibilityLabel="Upgrade plan for alerts">
              <Text style={[styles.ctaText, { color: c.accent }]}>View plans</Text>
            </Pressable>
          </RNView>
        ) : (
          <RNView style={[styles.liveBanner, { backgroundColor: c.accent + '18', borderColor: c.accent + '44' }]}>
            <FontAwesome name="bolt" size={16} color={c.accent} />
            <Text style={[styles.liveText, { color: c.text }]}>
              Pro / Elite: in-app line alerts (sample events below).
            </Text>
          </RNView>
        )}

        {MOCK_ALERTS.map((a) => (
          <RNView
            key={a.id}
            style={[styles.card, { backgroundColor: c.surface, borderColor: c.border, opacity: showRealtime ? 1 : 0.45 }]}
            accessibilityElementsHidden={!showRealtime}>
            <RNView style={styles.cardTop}>
              <RNView style={[styles.sportTag, { backgroundColor: c.background }]}>
                <Text style={[styles.sportText, { color: c.accent }]}>{a.sport}</Text>
              </RNView>
              <Text style={[styles.time, { color: c.muted }]}>{a.timeLabel}</Text>
            </RNView>
            <Text style={[styles.title, { color: c.text }]}>{a.title}</Text>
            <Text style={[styles.body, { color: c.textSecondary }]}>{a.body}</Text>
          </RNView>
        ))}

        <Text style={[styles.emailNote, { color: c.muted }]}>
          Base: enable &quot;Email alerts&quot; placeholder under Account. Nothing is sent in this MVP.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 28 },
  gate: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  gateTitle: { fontSize: 17, fontWeight: '800', marginTop: 12, marginBottom: 8, textAlign: 'center' },
  gateBody: { fontSize: 14, lineHeight: 20, textAlign: 'center', marginBottom: 14 },
  cta: { borderWidth: 1, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  ctaText: { fontWeight: '800', fontSize: 14 },
  liveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  liveText: { flex: 1, fontSize: 13, lineHeight: 18, fontWeight: '600' },
  card: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 12 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sportTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  sportText: { fontSize: 11, fontWeight: '800' },
  time: { fontSize: 12, fontWeight: '600' },
  title: { fontSize: 15, fontWeight: '800', marginBottom: 6 },
  body: { fontSize: 14, lineHeight: 20 },
  emailNote: { fontSize: 12, lineHeight: 17, textAlign: 'center', marginTop: 8 },
});
