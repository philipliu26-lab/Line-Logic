import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View as RNView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { Text } from '@/components/Themed';
import { useApp } from '@/context/AppContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const BAR_SET = [
  { label: 'CLV', h: 0.72 },
  { label: 'ROI', h: 0.45 },
  { label: 'Vol', h: 0.88 },
  { label: 'Sharp$', h: 0.55 },
];

export default function AnalyticsScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const { tier } = useApp();
  const showAdvanced = tier === 'pro' || tier === 'elite';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <DisclaimerBanner />

        <Text style={[styles.title, { color: c.text }]}>
          {showAdvanced ? 'Analytics dashboard' : 'Standard analytics'}
        </Text>
        <Text style={[styles.sub, { color: c.textSecondary }]}>
          {showAdvanced
            ? 'Pro / Elite: sample breakdowns and strategic overlays (still mock data).'
            : 'Dashboard included on Base. Deeper model splits unlock on Pro+.'}
        </Text>

        <RNView style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
          <Text style={[styles.cardTitle, { color: c.text }]}>Performance (sample)</Text>
          <RNView style={styles.chartRow}>
            {BAR_SET.map((b) => (
              <RNView key={b.label} style={styles.barCol}>
                <RNView
                  style={[
                    styles.barTrack,
                    { backgroundColor: c.background, borderColor: c.border },
                  ]}>
                  <RNView
                    style={[
                      styles.barFill,
                      { height: Math.max(8, Math.round(104 * b.h)), backgroundColor: c.accent },
                    ]}
                  />
                </RNView>
                <Text style={[styles.barLabel, { color: c.muted }]}>{b.label}</Text>
              </RNView>
            ))}
          </RNView>
          <RNView style={styles.kpis}>
            <Kpi label="Tracked bets" value={showAdvanced ? '42' : '—'} c={c} />
            <Kpi label="Win %" value={showAdvanced ? '54%' : '—'} c={c} />
            <Kpi label="Units" value={showAdvanced ? '+3.2' : '—'} c={c} />
          </RNView>
        </RNView>

        {showAdvanced ? (
          <RNView style={[styles.advanced, { backgroundColor: c.surface, borderColor: c.border }]}>
            <Text style={[styles.advancedTitle, { color: c.text }]}>Advanced model breakdowns</Text>
            <Text style={[styles.advancedBody, { color: c.textSecondary }]}>
              Feature importance (mock): line move velocity 32%, rest days 21%, matchup efficiency 18%,
              injury flags 12%, market width 9%, noise 8%.
            </Text>
            <Text style={[styles.advancedBody, { color: c.textSecondary }]}>
              Historical player overlays and simulation bands would attach to each pick detail in a
              production build.
            </Text>
          </RNView>
        ) : (
          <RNView style={[styles.locked, { backgroundColor: c.surface, borderColor: c.border }]}>
            <RNView style={[styles.lockIcon, { backgroundColor: c.muted + '22' }]}>
              <FontAwesome name="lock" size={20} color={c.muted} />
            </RNView>
            <Text style={[styles.lockedTitle, { color: c.text }]}>Advanced model breakdowns</Text>
            <Text style={[styles.lockedBody, { color: c.textSecondary }]}>
              Feature importance, simulation bands, historical player performance overlays—part of Pro
              and Elite.
            </Text>
            <Link href="/(tabs)/plans" asChild>
              <Pressable
                style={[styles.fakeBtn, { borderColor: c.accent }]}
                accessibilityRole="button"
                accessibilityLabel="View plans to upgrade">
                <Text style={[styles.fakeBtnText, { color: c.accent }]}>View plans</Text>
              </Pressable>
            </Link>
          </RNView>
        )}

        <Text style={[styles.emailNote, { color: c.muted }]}>
          Base includes email alerts (placeholder). Pro adds real-time line alerts in-app under Alerts.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Kpi({
  label,
  value,
  c,
}: {
  label: string;
  value: string;
  c: (typeof Colors)['light'];
}) {
  return (
    <RNView style={[styles.kpi, { borderColor: c.border }]}>
      <Text style={[styles.kpiValue, { color: c.text }]}>{value}</Text>
      <Text style={[styles.kpiLabel, { color: c.muted }]}>{label}</Text>
    </RNView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 28 },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 6 },
  sub: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  card: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 16 },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    height: 120,
    marginBottom: 16,
  },
  barCol: { flex: 1, alignItems: 'center' },
  barTrack: {
    flex: 1,
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 8,
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
    minHeight: 8,
  },
  barLabel: { fontSize: 11, fontWeight: '600' },
  kpis: { flexDirection: 'row', gap: 10 },
  kpi: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  kpiValue: { fontSize: 18, fontWeight: '800' },
  kpiLabel: { fontSize: 11, marginTop: 4 },
  advanced: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 16 },
  advancedTitle: { fontSize: 16, fontWeight: '800', marginBottom: 10 },
  advancedBody: { fontSize: 14, lineHeight: 21, marginBottom: 10 },
  locked: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  lockIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  lockedTitle: { fontSize: 16, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  lockedBody: { fontSize: 14, lineHeight: 20, textAlign: 'center', marginBottom: 14 },
  fakeBtn: {
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  fakeBtnText: { fontWeight: '700', fontSize: 14 },
  emailNote: { fontSize: 12, lineHeight: 17, textAlign: 'center' },
});
