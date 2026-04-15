import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams, router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View as RNView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { Text } from '@/components/Themed';
import { useApp } from '@/context/AppContext';
import { getPickById } from '@/data/picks';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function PickDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const { tier } = useApp();
  const pick = useMemo(() => (id ? getPickById(String(id)) : undefined), [id]);
  const [bankroll, setBankroll] = useState(1000);
  const [fraction, setFraction] = useState(0.02);

  const showPro = tier === 'pro' || tier === 'elite';
  const showElite = tier === 'elite';
  const suggested = Math.round(bankroll * fraction * 100) / 100;

  if (!pick) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={['bottom']}>
        <RNView style={styles.miss}>
          <Text style={{ color: c.text }}>Pick not found.</Text>
          <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Go back">
            <Text style={{ color: c.accent, marginTop: 12, fontWeight: '700' }}>Go back</Text>
          </Pressable>
        </RNView>
      </SafeAreaView>
    );
  }

  const spark = [40, 55, 48, 62, 58, 72, 68, 80, 75, 88];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <DisclaimerBanner />

        <RNView style={[styles.hero, { backgroundColor: c.surface, borderColor: c.border }]}>
          <RNView style={styles.heroTop}>
            <RNView style={[styles.tag, { backgroundColor: c.background }]}>
              <Text style={[styles.tagText, { color: c.accent }]}>{pick.sport}</Text>
            </RNView>
            {showElite && pick.premiumModel ? (
              <RNView style={[styles.elitePill, { backgroundColor: c.accent + '22' }]}>
                <Text style={[styles.elitePillText, { color: c.accent }]}>Premium model</Text>
              </RNView>
            ) : null}
            {showElite && pick.earlyLine ? (
              <RNView style={[styles.elitePill, { backgroundColor: c.positive + '22' }]}>
                <Text style={[styles.elitePillText, { color: c.positive }]}>Early line</Text>
              </RNView>
            ) : null}
          </RNView>
          <Text style={[styles.event, { color: c.text }]}>{pick.event}</Text>
          {pick.scheduledFor ? (
            <Text style={[styles.scheduledFor, { color: c.muted }]}>{pick.scheduledFor}</Text>
          ) : null}
          <Text style={[styles.pickLine, { color: c.text }]}>{pick.pick}</Text>
          <Text style={[styles.note, { color: c.textSecondary }]}>{pick.note}</Text>
        </RNView>

        {showPro ? (
          <RNView style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
            <RNView style={styles.scoreRow}>
              <Text style={[styles.cardTitle, { color: c.text }]}>Value score</Text>
              <RNView style={[styles.scoreBadge, { backgroundColor: c.accent + '22' }]}>
                <Text style={[styles.scoreNum, { color: c.accent }]}>{pick.valueScore}</Text>
                <Text style={[styles.scoreOut, { color: c.muted }]}>/ 100</Text>
              </RNView>
            </RNView>
            <Text style={[styles.cardSub, { color: c.textSecondary }]}>
              Higher = more model edge vs this mock market snapshot (demo only).
            </Text>
          </RNView>
        ) : (
          <RNView style={[styles.locked, { borderColor: c.border, backgroundColor: c.surface }]}>
            <FontAwesome name="lock" size={18} color={c.muted} />
            <Text style={[styles.lockedText, { color: c.textSecondary }]}>
              Value score and model breakdown unlock on Pro or Elite.
            </Text>
          </RNView>
        )}

        <Text style={[styles.h2, { color: c.text }]}>Odds comparison</Text>
        <RNView style={[styles.table, { backgroundColor: c.surface, borderColor: c.border }]}>
          <RNView style={[styles.tr, styles.trHead, { borderBottomColor: c.border }]}>
            <Text style={[styles.th, { color: c.muted, flex: 1.2 }]}>Book</Text>
            <Text style={[styles.th, { color: c.muted }]}>Spread</Text>
            <Text style={[styles.th, { color: c.muted }]}>Total</Text>
            <Text style={[styles.th, { color: c.muted }]}>ML</Text>
          </RNView>
          {pick.odds.map((row) => (
            <RNView key={row.book} style={[styles.tr, { borderBottomColor: c.border }]}>
              <Text style={[styles.td, { color: c.text, flex: 1.2, fontWeight: '600' }]}>
                {row.book}
              </Text>
              <Text style={[styles.td, { color: c.text }]}>{row.spread}</Text>
              <Text style={[styles.td, { color: c.text }]}>{row.total}</Text>
              <Text style={[styles.td, { color: c.accent, fontWeight: '700' }]}>{row.ml}</Text>
            </RNView>
          ))}
        </RNView>

        <Text style={[styles.h2, { color: c.text }]}>Line movement</Text>
        <Text style={[styles.sub, { color: c.textSecondary }]}>
          Open → now (sample). {pick.lineMoveLabel}.
        </Text>
        <RNView style={[styles.moveCard, { backgroundColor: c.surface, borderColor: c.border }]}>
          <RNView style={styles.sparkRow}>
            {spark.map((h, i) => (
              <RNView
                key={i}
                style={[
                  styles.sparkBar,
                  {
                    height: h * 0.35,
                    backgroundColor: i > 6 ? c.accent : c.muted + '66',
                  },
                ]}
              />
            ))}
          </RNView>
          <RNView style={styles.moveFooter}>
            <Text style={[styles.moveMeta, { color: c.text }]}>Open {pick.lineOpen}</Text>
            <Text style={[styles.moveMeta, { color: c.accent, fontWeight: '700' }]}>Now {pick.lineNow}</Text>
          </RNView>
        </RNView>

        {showPro ? (
          <>
            <Text style={[styles.h2, { color: c.text }]}>Model breakdown</Text>
            {pick.breakdown.map((line, i) => (
              <RNView key={i} style={styles.bulletRow}>
                <Text style={[styles.bullet, { color: c.accent }]}>•</Text>
                <Text style={[styles.bulletText, { color: c.textSecondary }]}>{line}</Text>
              </RNView>
            ))}
            <RNView style={[styles.insight, { backgroundColor: c.surface, borderColor: c.border }]}>
              <Text style={[styles.insightLabel, { color: c.muted }]}>Strategic insight</Text>
              <Text style={[styles.insightBody, { color: c.text }]}>{pick.strategicInsight}</Text>
            </RNView>
            <Text style={[styles.h2, { color: c.text }]}>Historical snapshot</Text>
            <Text style={[styles.hist, { color: c.textSecondary }]}>{pick.historicalBlurb}</Text>
          </>
        ) : null}

        {showElite && pick.injuryNote ? (
          <>
            <Text style={[styles.h2, { color: c.text }]}>Player & injury</Text>
            <RNView style={[styles.injury, { borderColor: c.border, backgroundColor: c.surface }]}>
              <FontAwesome name="medkit" size={16} color={c.accent} />
              <Text style={[styles.injuryText, { color: c.textSecondary }]}>{pick.injuryNote}</Text>
            </RNView>
          </>
        ) : null}

        {showElite ? (
          <RNView style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
            <Text style={[styles.cardTitle, { color: c.text }]}>Custom bet sizing (demo)</Text>
            <Text style={[styles.cardSub, { color: c.textSecondary }]}>
              Fake bankroll: ${bankroll}. Suggested stake (fraction {Math.round(fraction * 100)}%):{' '}
              <Text style={{ color: c.accent, fontWeight: '800' }}>${suggested}</Text>
            </Text>
            <Text style={[styles.sliderLabel, { color: c.muted }]}>Bankroll</Text>
            <RNView style={styles.stepRow}>
              {[500, 1000, 2500, 5000].map((v) => (
                <Pressable
                  key={v}
                  onPress={() => setBankroll(v)}
                  style={[
                    styles.chip,
                    { borderColor: bankroll === v ? c.accent : c.border, backgroundColor: bankroll === v ? c.accent + '18' : c.background },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Set bankroll to ${v} dollars`}>
                  <Text style={{ color: c.text, fontWeight: '700', fontSize: 13 }}>${v}</Text>
                </Pressable>
              ))}
            </RNView>
            <Text style={[styles.sliderLabel, { color: c.muted }]}>Stake fraction</Text>
            <RNView style={styles.stepRow}>
              {[0.01, 0.02, 0.03, 0.05].map((v) => (
                <Pressable
                  key={v}
                  onPress={() => setFraction(v)}
                  style={[
                    styles.chip,
                    { borderColor: fraction === v ? c.accent : c.border, backgroundColor: fraction === v ? c.accent + '18' : c.background },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Stake fraction ${Math.round(v * 100)} percent`}>
                  <Text style={{ color: c.text, fontWeight: '700', fontSize: 13 }}>
                    {Math.round(v * 100)}%
                  </Text>
                </Pressable>
              ))}
            </RNView>
          </RNView>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 40 },
  miss: { padding: 24 },
  hero: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 14 },
  heroTop: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 10 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagText: { fontSize: 11, fontWeight: '800' },
  elitePill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  elitePillText: { fontSize: 11, fontWeight: '800' },
  event: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  scheduledFor: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  pickLine: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  note: { fontSize: 14, lineHeight: 20 },
  card: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '800' },
  cardSub: { fontSize: 13, lineHeight: 19, marginTop: 8 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scoreBadge: { flexDirection: 'row', alignItems: 'baseline', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  scoreNum: { fontSize: 22, fontWeight: '800' },
  scoreOut: { fontSize: 14, fontWeight: '600', marginLeft: 2 },
  locked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  lockedText: { flex: 1, fontSize: 14, lineHeight: 20 },
  h2: { fontSize: 17, fontWeight: '800', marginBottom: 8, marginTop: 4 },
  sub: { fontSize: 13, lineHeight: 18, marginBottom: 10 },
  table: { borderRadius: 14, borderWidth: 1, overflow: 'hidden', marginBottom: 18 },
  tr: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12 },
  trHead: { borderBottomWidth: 1 },
  th: { flex: 1, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  td: { flex: 1, fontSize: 13 },
  moveCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 18 },
  sparkRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 44,
    gap: 3,
    marginBottom: 12,
  },
  sparkBar: { flex: 1, borderRadius: 3, minHeight: 4 },
  moveFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  moveMeta: { fontSize: 14 },
  bulletRow: { flexDirection: 'row', gap: 8, marginBottom: 8, paddingRight: 8 },
  bullet: { fontSize: 16, fontWeight: '800', width: 14 },
  bulletText: { flex: 1, fontSize: 14, lineHeight: 20 },
  insight: { borderRadius: 14, borderWidth: 1, padding: 14, marginTop: 12, marginBottom: 16 },
  insightLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 6 },
  insightBody: { fontSize: 14, lineHeight: 21 },
  hist: { fontSize: 14, lineHeight: 21, marginBottom: 16 },
  injury: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  injuryText: { flex: 1, fontSize: 14, lineHeight: 20 },
  sliderLabel: { fontSize: 12, fontWeight: '700', marginTop: 12, marginBottom: 8 },
  stepRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
});
