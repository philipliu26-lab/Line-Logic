import { StyleSheet, ScrollView, View as RNView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function HomeScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <DisclaimerBanner />
        <RNView style={[styles.card, styles.taglineCard, { backgroundColor: c.surface, borderColor: c.border }]}>
          <Text style={[styles.taglineKicker, { color: c.muted }]}>Why Line Logic</Text>
          <Text style={[styles.tagline, { color: c.textSecondary }]}>
            Turn gut-feel bets into decisions you can defend—with live lines, model context, and
            proof on screen.
          </Text>
        </RNView>

        <RNView style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
          <RNView style={styles.cardHeader}>
            <FontAwesome name="bolt" size={16} color={c.accent} />
            <Text style={[styles.cardTitle, { color: c.text }]}>Today&apos;s edge snapshot</Text>
          </RNView>
          <Text style={[styles.mockLabel, { color: c.muted }]}>Sample data — MVP preview</Text>
          <RNView style={styles.statRow}>
            <StatBlock label="Active lines tracked" value="128" sub="NBA · NHL · MLB" c={c} />
            <StatBlock label="Avg. line move (24h)" value="1.2" sub="pts / spread" c={c} />
          </RNView>
        </RNView>

        <RNView style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>How it works</Text>
          <Step
            n={1}
            title="Compare books"
            body="Side-by-side odds so you see where the number is sharp."
            c={c}
          />
          <Step
            n={2}
            title="Track steam"
            body="Line movement with timestamps—evidence, not vibes."
            c={c}
          />
          <Step
            n={3}
            title="AI picks with limits"
            body="Tiered daily picks with value context on Pro and Elite."
            c={c}
          />
        </RNView>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBlock({
  label,
  value,
  sub,
  c,
}: {
  label: string;
  value: string;
  sub: string;
  c: (typeof Colors)['light'];
}) {
  return (
    <RNView style={[styles.statBlock, { borderColor: c.border }]}>
      <Text style={[styles.statValue, { color: c.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: c.muted }]}>{label}</Text>
      <Text style={[styles.statSub, { color: c.textSecondary }]}>{sub}</Text>
    </RNView>
  );
}

function Step({
  n,
  title,
  body,
  c,
}: {
  n: number;
  title: string;
  body: string;
  c: (typeof Colors)['light'];
}) {
  return (
    <RNView style={styles.stepRow}>
      <RNView style={[styles.stepBadge, { backgroundColor: c.accent + '22' }]}>
        <Text style={[styles.stepNum, { color: c.accent }]}>{n}</Text>
      </RNView>
      <RNView style={styles.stepText}>
        <Text style={[styles.stepTitle, { color: c.text }]}>{title}</Text>
        <Text style={[styles.stepBody, { color: c.textSecondary }]}>{body}</Text>
      </RNView>
    </RNView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 32 },
  taglineCard: {
    marginBottom: 16,
  },
  taglineKicker: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  tagline: { fontSize: 16, lineHeight: 24 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  mockLabel: { fontSize: 12, marginBottom: 14 },
  statRow: { flexDirection: 'row', gap: 12 },
  statBlock: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  statSub: { fontSize: 12, marginTop: 4 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 14 },
  stepRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: { fontWeight: '800', fontSize: 14 },
  stepText: { flex: 1 },
  stepTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  stepBody: { fontSize: 14, lineHeight: 20 },
});
