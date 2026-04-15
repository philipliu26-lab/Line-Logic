import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, TextInput, View as RNView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useMemo, useState } from 'react';

import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { Text } from '@/components/Themed';
import { useApp } from '@/context/AppContext';
import { MOCK_PICKS } from '@/data/picks';
import {
  loadTrackedBets,
  saveTrackedBets,
  seedDemoBets,
  summarizeBets,
  type BetResult,
  type TrackedBet,
} from '@/lib/trackedBets';
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
  const [bets, setBets] = useState<TrackedBet[]>([]);
  const [ready, setReady] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [formEvent, setFormEvent] = useState('');
  const [formPick, setFormPick] = useState('');
  const [formSport, setFormSport] = useState<'NBA' | 'MLB'>('NBA');
  const [formOdds, setFormOdds] = useState('-110');
  const [formStake, setFormStake] = useState('25');
  const [formResult, setFormResult] = useState<BetResult>('pending');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const loaded = await loadTrackedBets();
      if (cancelled) return;
      const isLegacySeed =
        loaded.some((b) => b.event === 'Warriors @ Clippers') ||
        loaded.some((b) => b.event === 'Dodgers vs Mets') ||
        loaded.some((b) => b.event === 'Giants vs Reds');

      if (loaded.length === 0 || isLegacySeed) {
        const seeded = seedDemoBets();
        setBets(seeded);
        await saveTrackedBets(seeded);
      } else {
        setBets(loaded);
      }
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const summary = useMemo(() => summarizeBets(bets), [bets]);
  const recent = useMemo(
    () => [...bets].sort((a, b) => b.placedAt - a.placedAt).slice(0, 6),
    [bets]
  );

  const addBet = async () => {
    const oddsAmerican = Number(formOdds);
    const stake = Number(formStake);
    if (!formEvent.trim() || !formPick.trim()) return;
    if (!Number.isFinite(oddsAmerican) || oddsAmerican === 0) return;
    if (!Number.isFinite(stake) || stake <= 0) return;

    const next: TrackedBet = {
      id: `b-${Date.now()}`,
      sport: formSport,
      event: formEvent.trim(),
      pick: formPick.trim(),
      oddsAmerican,
      stake,
      placedAt: Date.now(),
      result: formResult,
    };
    const updated = [next, ...bets];
    setBets(updated);
    await saveTrackedBets(updated);
    setShowAdd(false);
    setFormEvent('');
    setFormPick('');
    setFormOdds('-110');
    setFormStake('25');
    setFormResult('pending');
  };

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
          <RNView style={styles.cardHeaderRow}>
            <Text style={[styles.cardTitle, { color: c.text }]}>Tracked bets</Text>
            <Pressable
              onPress={() => setShowAdd((v) => !v)}
              style={[styles.smallBtn, { borderColor: c.border, backgroundColor: c.background }]}
              accessibilityRole="button"
              accessibilityLabel="Add tracked bet">
              <Text style={[styles.smallBtnText, { color: c.text }]}>{showAdd ? 'Close' : 'Add'}</Text>
            </Pressable>
          </RNView>

          {!ready ? (
            <Text style={[styles.sub, { color: c.textSecondary, marginBottom: 0 }]}>Loading…</Text>
          ) : (
            <>
              <RNView style={styles.kpis}>
                <Kpi label="Tracked" value={String(summary.tracked)} c={c} />
                <Kpi
                  label="Win %"
                  value={summary.winPct == null ? '—' : `${Math.round(summary.winPct * 100)}%`}
                  c={c}
                />
                <Kpi label="Net $" value={`${summary.profit >= 0 ? '+' : ''}${summary.profit.toFixed(2)}`} c={c} />
              </RNView>
              <RNView style={styles.kpis2}>
                <Kpi label="Decided" value={String(summary.decided)} c={c} />
                <Kpi label="W-L-P" value={`${summary.wins}-${summary.losses}-${summary.pushes}`} c={c} />
                <Kpi
                  label="ROI"
                  value={summary.roiPct == null ? '—' : `${(summary.roiPct * 100).toFixed(1)}%`}
                  c={c}
                />
              </RNView>

              {showAdd ? (
                <RNView style={[styles.form, { borderColor: c.border, backgroundColor: c.background }]}>
                  <Text style={[styles.formLabel, { color: c.muted }]}>Sport</Text>
                  <RNView style={styles.pillRow}>
                    {(['NBA', 'MLB'] as const).map((s) => {
                      const active = formSport === s;
                      return (
                        <Pressable
                          key={s}
                          onPress={() => setFormSport(s)}
                          style={[
                            styles.pill,
                            {
                              borderColor: active ? c.accent : c.border,
                              backgroundColor: active ? c.accent + '18' : c.surface,
                            },
                          ]}>
                          <Text style={[styles.pillText, { color: active ? c.accent : c.text }]}>{s}</Text>
                        </Pressable>
                      );
                    })}
                  </RNView>

                  <Text style={[styles.formLabel, { color: c.muted }]}>Event</Text>
                  <TextInput
                    value={formEvent}
                    onChangeText={setFormEvent}
                    placeholder="Warriors @ Clippers"
                    placeholderTextColor={c.muted}
                    style={[styles.input, { color: c.text, borderColor: c.border, backgroundColor: c.surface }]}
                  />
                  <Text style={[styles.formLabel, { color: c.muted }]}>Pick</Text>
                  <TextInput
                    value={formPick}
                    onChangeText={setFormPick}
                    placeholder="Clippers -4.5"
                    placeholderTextColor={c.muted}
                    style={[styles.input, { color: c.text, borderColor: c.border, backgroundColor: c.surface }]}
                  />
                  <RNView style={styles.formRow}>
                    <RNView style={styles.formCol}>
                      <Text style={[styles.formLabel, { color: c.muted }]}>Odds</Text>
                      <TextInput
                        value={formOdds}
                        onChangeText={setFormOdds}
                        placeholder="-110"
                        placeholderTextColor={c.muted}
                        keyboardType="numbers-and-punctuation"
                        style={[styles.input, { color: c.text, borderColor: c.border, backgroundColor: c.surface }]}
                      />
                    </RNView>
                    <RNView style={styles.formCol}>
                      <Text style={[styles.formLabel, { color: c.muted }]}>Stake ($)</Text>
                      <TextInput
                        value={formStake}
                        onChangeText={setFormStake}
                        placeholder="25"
                        placeholderTextColor={c.muted}
                        keyboardType="decimal-pad"
                        style={[styles.input, { color: c.text, borderColor: c.border, backgroundColor: c.surface }]}
                      />
                    </RNView>
                  </RNView>

                  <Text style={[styles.formLabel, { color: c.muted }]}>Result</Text>
                  <RNView style={styles.pillRow}>
                    {(['pending', 'win', 'loss', 'push'] as const).map((r) => {
                      const active = formResult === r;
                      return (
                        <Pressable
                          key={r}
                          onPress={() => setFormResult(r)}
                          style={[
                            styles.pill,
                            {
                              borderColor: active ? c.accent : c.border,
                              backgroundColor: active ? c.accent + '18' : c.surface,
                            },
                          ]}>
                          <Text style={[styles.pillText, { color: active ? c.accent : c.text }]}>{r}</Text>
                        </Pressable>
                      );
                    })}
                  </RNView>

                  <Pressable
                    onPress={addBet}
                    style={[styles.primaryBtn, { backgroundColor: c.accent }]}
                    accessibilityRole="button"
                    accessibilityLabel="Save tracked bet">
                    <Text style={[styles.primaryBtnText, { color: '#fff' }]}>Save bet</Text>
                  </Pressable>
                </RNView>
              ) : null}

              <Text style={[styles.sectionLabel, { color: c.muted }]}>Recent</Text>
              {recent.map((b) => (
                <RNView key={b.id} style={[styles.betRow, { borderColor: c.border, backgroundColor: c.background }]}>
                  <RNView style={styles.betLeft}>
                    <Text style={[styles.betEvent, { color: c.text }]} numberOfLines={1}>
                      {b.event}
                    </Text>
                    <Text style={[styles.betPick, { color: c.textSecondary }]} numberOfLines={1}>
                      {b.pick} · {b.oddsAmerican > 0 ? `+${b.oddsAmerican}` : `${b.oddsAmerican}`} · ${b.stake}
                    </Text>
                  </RNView>
                  <RNView style={[styles.badge, { backgroundColor: badgeBg(b.result, c), borderColor: badgeBorder(b.result, c) }]}>
                    <Text style={[styles.badgeText, { color: badgeText(b.result, c) }]}>{b.result}</Text>
                  </RNView>
                </RNView>
              ))}
            </>
          )}
        </RNView>

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
            <Kpi label="Tracked bets" value={String(summary.tracked)} c={c} />
            <Kpi label="Win %" value={summary.winPct == null ? '—' : `${Math.round(summary.winPct * 100)}%`} c={c} />
            <Kpi label="Net $" value={`${summary.profit >= 0 ? '+' : ''}${summary.profit.toFixed(2)}`} c={c} />
          </RNView>
        </RNView>

        {showAdvanced ? (
          <RNView style={[styles.advanced, { backgroundColor: c.surface, borderColor: c.border }]}>
            <Text style={[styles.advancedTitle, { color: c.text }]}>Advanced model breakdowns</Text>
            <Text style={[styles.advancedBody, { color: c.textSecondary }]}>
              Feature importance (mock): line move velocity 32%, rest days 21%, matchup efficiency 18%,
              injury flags 12%, market width 9%, noise 8%.
            </Text>

            <Text style={[styles.previewSectionLabel, { color: c.muted }]}>
              Featured picks — model previews
            </Text>
            {MOCK_PICKS.map((pick) => (
              <Pressable
                key={pick.id}
                onPress={() => router.push(`/pick/${pick.id}`)}
                style={({ pressed }) => [
                  styles.previewCard,
                  {
                    backgroundColor: c.background,
                    borderColor: c.border,
                    opacity: pressed ? 0.92 : 1,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Open model breakdown for ${pick.event}`}>
                <RNView style={styles.previewCardTop}>
                  <RNView style={[styles.previewSport, { backgroundColor: c.surface }]}>
                    <Text style={[styles.previewSportText, { color: c.accent }]}>{pick.sport}</Text>
                  </RNView>
                  <RNView style={styles.previewTitleBlock}>
                    <Text style={[styles.previewEvent, { color: c.text }]} numberOfLines={2}>
                      {pick.event}
                    </Text>
                    <RNView style={styles.previewScoreRow}>
                      <Text style={[styles.previewScoreLabel, { color: c.muted }]}>Value score</Text>
                      <Text style={[styles.previewScoreNum, { color: c.accent }]}>{pick.valueScore}</Text>
                    </RNView>
                  </RNView>
                </RNView>
                {pick.breakdown.slice(0, 2).map((line, i) => (
                  <RNView key={i} style={styles.previewBulletRow}>
                    <Text style={[styles.previewBullet, { color: c.accent }]}>•</Text>
                    <Text style={[styles.previewBulletText, { color: c.textSecondary }]} numberOfLines={3}>
                      {line}
                    </Text>
                  </RNView>
                ))}
                <RNView style={[styles.previewInsight, { borderLeftColor: c.accent }]}>
                  <Text style={[styles.previewInsightLabel, { color: c.muted }]}>Strategic insight</Text>
                  <Text style={[styles.previewInsightBody, { color: c.text }]} numberOfLines={3}>
                    {pick.strategicInsight}
                  </Text>
                </RNView>
                <RNView style={styles.previewLinkRow}>
                  <Text style={[styles.previewLink, { color: c.accent }]}>Full breakdown & proof</Text>
                  <FontAwesome name="chevron-right" size={11} color={c.accent} />
                </RNView>
              </Pressable>
            ))}
            <Text style={[styles.advancedFoot, { color: c.muted }]}>
              Simulation bands and historical player overlays appear on each pick detail (Elite).
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
            <Pressable
              onPress={() => router.push('/(tabs)/plans')}
              style={[styles.fakeBtn, { borderColor: c.accent }]}
              accessibilityRole="button"
              accessibilityLabel="View plans to upgrade">
              <Text style={[styles.fakeBtnText, { color: c.accent }]}>View plans</Text>
            </Pressable>
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

function badgeBg(r: BetResult, c: (typeof Colors)['light']) {
  if (r === 'win') return c.accent + '18';
  if (r === 'loss') return '#ff3b3018';
  if (r === 'push') return c.muted + '22';
  return c.background;
}
function badgeBorder(r: BetResult, c: (typeof Colors)['light']) {
  if (r === 'win') return c.accent + '55';
  if (r === 'loss') return '#ff3b3055';
  if (r === 'push') return c.border;
  return c.border;
}
function badgeText(r: BetResult, c: (typeof Colors)['light']) {
  if (r === 'win') return c.accent;
  if (r === 'loss') return '#ff3b30';
  if (r === 'push') return c.muted;
  return c.muted;
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 28 },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 6 },
  sub: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  card: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 16 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 16 },
  smallBtn: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  smallBtnText: { fontWeight: '800', fontSize: 12 },
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
  kpis2: { flexDirection: 'row', gap: 10, marginTop: 10 },
  kpi: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  kpiValue: { fontSize: 18, fontWeight: '800' },
  kpiLabel: { fontSize: 11, marginTop: 4 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginTop: 14,
    marginBottom: 10,
  },
  form: { borderWidth: 1, borderRadius: 12, padding: 12, marginTop: 12 },
  formLabel: { fontSize: 11, fontWeight: '700', marginTop: 10, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, fontWeight: '600' },
  formRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  formCol: { flex: 1 },
  pillRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  pill: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 7 },
  pillText: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
  primaryBtn: { marginTop: 12, paddingVertical: 11, borderRadius: 10, alignItems: 'center' },
  primaryBtnText: { fontSize: 14, fontWeight: '900' },
  betRow: { borderWidth: 1, borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  betLeft: { flex: 1, minWidth: 0, paddingRight: 10 },
  betEvent: { fontSize: 13, fontWeight: '800', marginBottom: 3 },
  betPick: { fontSize: 12, fontWeight: '600' },
  badge: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  badgeText: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  advanced: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 16 },
  advancedTitle: { fontSize: 16, fontWeight: '800', marginBottom: 10 },
  advancedBody: { fontSize: 14, lineHeight: 21, marginBottom: 14 },
  advancedFoot: { fontSize: 12, lineHeight: 17, marginTop: 4 },
  previewSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  previewCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  previewCardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  previewSport: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  previewSportText: { fontSize: 10, fontWeight: '800' },
  previewTitleBlock: { flex: 1, minWidth: 0 },
  previewEvent: { fontSize: 14, fontWeight: '700', marginBottom: 6 },
  previewScoreRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  previewScoreLabel: { fontSize: 11, fontWeight: '600' },
  previewScoreNum: { fontSize: 16, fontWeight: '800' },
  previewBulletRow: { flexDirection: 'row', gap: 8, marginBottom: 6, paddingRight: 4 },
  previewBullet: { fontSize: 14, fontWeight: '800', width: 12, lineHeight: 20 },
  previewBulletText: { flex: 1, fontSize: 13, lineHeight: 19 },
  previewInsight: {
    borderLeftWidth: 3,
    paddingLeft: 10,
    marginTop: 4,
    marginBottom: 8,
  },
  previewInsightLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  previewInsightBody: { fontSize: 13, lineHeight: 19 },
  previewLinkRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  previewLink: { fontSize: 13, fontWeight: '800' },
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
