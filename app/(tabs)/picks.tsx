import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View as RNView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { Text } from '@/components/Themed';
import { useApp } from '@/context/AppContext';
import { MOCK_PICKS } from '@/data/picks';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

function tierLabel(t: string) {
  if (t === 'pro') return 'Pro · $49/mo';
  if (t === 'elite') return 'Elite · $99/mo';
  return 'Base · Free';
}

export default function PicksScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const {
    tier,
    pickUsage,
    refreshPickUsage,
    revealNextPick,
    dailyPickCap,
    planDailyLimit,
    catalogCount,
    ready,
  } = useApp();
  const [busy, setBusy] = useState(false);
  const [revealPressed, setRevealPressed] = useState(false);
  const [detailPressedId, setDetailPressedId] = useState<string | null>(null);

  const cap = dailyPickCap;
  /** Slots unlocked from the top of the list; never above today’s cap (storage is clamped on load). */
  const slotsRevealed = Math.min(pickUsage?.revealedCount ?? 0, cap);
  const canRevealMore = slotsRevealed < cap;

  const onReveal = useCallback(async () => {
    setBusy(true);
    try {
      const result = await revealNextPick();
      if (!result.ok) {
        await refreshPickUsage();
      }
    } finally {
      setBusy(false);
    }
  }, [revealNextPick, refreshPickUsage]);

  if (!ready || !pickUsage) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={['bottom']}>
        <RNView style={styles.loading}>
          <ActivityIndicator color={c.accent} />
        </RNView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <DisclaimerBanner />

        <RNView style={[styles.tierBanner, { backgroundColor: c.surface, borderColor: c.border }]}>
          <RNView style={styles.tierRow}>
            <Text style={[styles.tierLabel, { color: c.muted }]}>Your plan</Text>
            <RNView style={[styles.badge, { backgroundColor: c.accent + '28' }]}>
              <Text style={[styles.badgeText, { color: c.accent }]}>{tierLabel(tier)}</Text>
            </RNView>
          </RNView>
          <RNView style={styles.counterRow}>
            <Text style={[styles.counterMain, { color: c.text }]} accessibilityLiveRegion="polite">
              <Text style={{ color: c.accent, fontWeight: '800' }}>{slotsRevealed}</Text>
              <Text style={{ color: c.muted }}> / {cap} </Text>
              AI picks revealed today
            </Text>
            <FontAwesome name="lock" size={14} color={c.muted} accessibilityLabel="" />
          </RNView>
          <Text style={[styles.tierHint, { color: c.textSecondary }]}>
            Resets at local midnight. Daily cap is the lower of your plan (
            {planDailyLimit >= 9999 ? 'unlimited' : planDailyLimit} per day) and today&apos;s catalog (
            {catalogCount} picks).
          </Text>
        </RNView>

        {canRevealMore ? (
          <Pressable
            onPress={onReveal}
            disabled={busy}
            onPressIn={() => setRevealPressed(true)}
            onPressOut={() => setRevealPressed(false)}
            style={[
              styles.revealBtn,
              { backgroundColor: c.accent, opacity: busy || revealPressed ? 0.85 : 1 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Reveal next AI pick"
            accessibilityHint="Uses one pick from your daily allowance">
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.revealBtnText}>Reveal next AI pick</Text>
            )}
          </Pressable>
        ) : (
          <RNView style={[styles.limitBox, { borderColor: c.border, backgroundColor: c.surface }]}>
            <Text style={[styles.limitText, { color: c.textSecondary }]}>
              You&apos;ve reached today&apos;s limit for your plan. Upgrade under Account for more picks, or
              check back after midnight (local time).
            </Text>
            <Pressable
              onPress={() => router.push('/(tabs)/plans')}
              style={[styles.linkBtn, { borderColor: c.accent }]}
              accessibilityRole="button"
              accessibilityLabel="Open account and plans">
              <Text style={[styles.linkBtnText, { color: c.accent }]}>View Account</Text>
            </Pressable>
          </RNView>
        )}

        <Text style={[styles.sectionLabel, { color: c.muted }]}>Today&apos;s picks</Text>

        {MOCK_PICKS.map((p, index) => {
          const unlocked = index < slotsRevealed;
          return (
            <RNView
              key={p.id}
              style={[styles.pickCard, { backgroundColor: c.surface, borderColor: c.border }]}>
              <RNView style={styles.pickTop}>
                <RNView style={[styles.sportTag, { backgroundColor: c.background }]}>
                  <Text style={[styles.sportText, { color: c.accent }]}>{p.sport}</Text>
                </RNView>
                <Text style={[styles.event, { color: c.text }]}>{p.event}</Text>
              </RNView>
              {unlocked ? (
                <>
                  <Text style={[styles.pickLine, { color: c.text }]}>{p.pick}</Text>
                  <Text style={[styles.pickNote, { color: c.textSecondary }]}>{p.note}</Text>
                  {(tier === 'pro' || tier === 'elite') && (
                    <RNView style={[styles.valueRow, { marginTop: 10 }]}>
                      <Text style={[styles.valueLabel, { color: c.muted }]}>Value score</Text>
                      <Text style={[styles.valueNum, { color: c.accent }]}>{p.valueScore}</Text>
                    </RNView>
                  )}
                  <Pressable
                    onPress={() => router.push(`/pick/${p.id}`)}
                    onPressIn={() => setDetailPressedId(p.id)}
                    onPressOut={() => setDetailPressedId(null)}
                    style={[
                      styles.detailBtn,
                      { opacity: detailPressedId === p.id ? 0.8 : 1 },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Open details for ${p.event}`}>
                    <Text style={[styles.detailBtnText, { color: c.accent }]}>View proof & detail</Text>
                    <FontAwesome name="chevron-right" size={12} color={c.accent} />
                  </Pressable>
                </>
              ) : (
                <RNView style={styles.lockedBody}>
                  <FontAwesome name="eye-slash" size={22} color={c.muted} />
                  <Text style={[styles.lockedTitle, { color: c.text }]}>Locked pick</Text>
                  <Text style={[styles.lockedSub, { color: c.textSecondary }]}>
                    Tap &quot;Reveal next AI pick&quot; to unlock another slot today.
                  </Text>
                </RNView>
              )}
            </RNView>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  scroll: { padding: 16, paddingBottom: 28 },
  tierBanner: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
  },
  tierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tierLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counterMain: { fontSize: 18, fontWeight: '600' },
  tierHint: { fontSize: 13, marginTop: 8, lineHeight: 18 },
  revealBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 18,
  },
  revealBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  limitBox: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
  },
  limitText: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  linkBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  linkBtnText: { fontWeight: '800', fontSize: 14 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  pickCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  pickTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  sportTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  sportText: { fontSize: 11, fontWeight: '800' },
  event: { fontSize: 14, fontWeight: '600', flex: 1 },
  pickLine: { fontSize: 17, fontWeight: '800', marginBottom: 6 },
  pickNote: { fontSize: 13, lineHeight: 18 },
  valueRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  valueLabel: { fontSize: 12, fontWeight: '600' },
  valueNum: { fontSize: 18, fontWeight: '800' },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
  },
  detailBtnText: { fontSize: 14, fontWeight: '800' },
  lockedBody: { alignItems: 'center', paddingVertical: 20 },
  lockedTitle: { fontSize: 15, fontWeight: '800', marginTop: 10 },
  lockedSub: { fontSize: 13, textAlign: 'center', marginTop: 6, paddingHorizontal: 8, lineHeight: 18 },
});
