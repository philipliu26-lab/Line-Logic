import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams, router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View as RNView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { Text } from '@/components/Themed';
import { type GameRosterDefinition, getGameRosterByPickId } from '@/data/gameRosters';
import { getPickById } from '@/data/picks';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

function formatStatCell(sport: 'NBA' | 'MLB', columnKey: string, v: number) {
  if (sport === 'NBA') {
    if (columnKey === 'gp') return String(Math.round(v));
    const x = Math.round(v * 10) / 10;
    return Number.isInteger(x) ? String(x) : x.toFixed(1);
  }
  if (columnKey === 'avg' || columnKey === 'ops') return v.toFixed(3);
  return String(Math.round(v));
}

export default function GameRosterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  const pick = useMemo(() => (id ? getPickById(String(id)) : undefined), [id]);
  const bundle = useMemo(() => (id ? getGameRosterByPickId(String(id)) : undefined), [id]);

  if (!pick || !bundle) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={['bottom']}>
        <RNView style={styles.miss}>
          <Text style={{ color: c.text }}>Game roster not available for this pick.</Text>
          <Text style={{ color: c.muted, marginTop: 8, fontSize: 13 }}>
            Rosters are only wired for featured catalog games.
          </Text>
          <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Go back">
            <Text style={{ color: c.accent, marginTop: 12, fontWeight: '700' }}>Go back</Text>
          </Pressable>
        </RNView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <DisclaimerBanner />

        <RNView style={[styles.hero, { backgroundColor: c.surface, borderColor: c.border }]}>
          <RNView style={styles.heroTop}>
            <RNView style={[styles.tag, { backgroundColor: c.background }]}>
              <Text style={[styles.tagText, { color: c.accent }]}>{pick.sport}</Text>
            </RNView>
            <RNView style={[styles.preTipPill, { backgroundColor: c.muted + '22' }]}>
              <FontAwesome name="clock-o" size={12} color={c.muted} />
              <Text style={[styles.preTipPillText, { color: c.muted }]}>Pre-tip · game not started</Text>
            </RNView>
          </RNView>
          <Text style={[styles.event, { color: c.text }]}>{pick.event}</Text>
          {pick.scheduledFor ? (
            <Text style={[styles.scheduledFor, { color: c.muted }]}>{pick.scheduledFor}</Text>
          ) : null}
          <Text style={[styles.seasonLine, { color: c.textSecondary }]}>
            Active lineups show <Text style={{ fontWeight: '800', color: c.text }}>season averages</Text> ·{' '}
            {bundle.statWindowLabel}
          </Text>
          <Text style={[styles.demoNote, { color: c.muted }]}>
            Injured players are omitted from lineups and listed below with status. Demo data only.
          </Text>
        </RNView>

        <RosterBlock title={`${bundle.away.abbr} · ${bundle.away.name}`} side={bundle.away} bundle={bundle} c={c} />
        <RosterBlock title={`${bundle.home.abbr} · ${bundle.home.name}`} side={bundle.home} bundle={bundle} c={c} />
      </ScrollView>
    </SafeAreaView>
  );
}

function RosterBlock({
  title,
  side,
  bundle,
  c,
}: {
  title: string;
  side: GameRosterDefinition['away'];
  bundle: GameRosterDefinition;
  c: (typeof Colors)['light'];
}) {
  const cols = bundle.columns;

  return (
    <RNView style={{ marginBottom: 20 }}>
      <Text style={[styles.tableTitle, { color: c.text }]}>{title}</Text>
      <Text style={[styles.tableSub, { color: c.muted }]}>Projected available roster</Text>
      <RNView style={[styles.table, { backgroundColor: c.surface, borderColor: c.border }]}>
        <RNView style={[styles.tr, styles.trHead, { borderBottomColor: c.border }]}>
          <Text style={[styles.thPlayer, { color: c.muted }]}>Player</Text>
          {cols.map((col) => (
            <Text key={col.key} style={[styles.thNum, { color: c.muted }]}>
              {col.label}
            </Text>
          ))}
        </RNView>
        {side.players.map((row) => (
          <RNView key={`${side.abbr}-${row.num}-${row.name}`} style={[styles.tr, { borderBottomColor: c.border }]}>
            <RNView style={styles.playerCell}>
              <Text style={[styles.jersey, { color: c.muted }]}>#{row.num}</Text>
              <RNView style={{ flex: 1, minWidth: 0 }}>
                <Text style={[styles.name, { color: c.text }]} numberOfLines={1}>
                  {row.name}
                </Text>
                <Text style={[styles.pos, { color: c.textSecondary }]}>{row.pos}</Text>
              </RNView>
            </RNView>
            {row.stats.map((v, i) => (
              <Text key={cols[i]?.key ?? i} style={[styles.tdNum, { color: c.accent, fontWeight: '700' }]}>
                {formatStatCell(bundle.sport, cols[i]?.key ?? '', v)}
              </Text>
            ))}
          </RNView>
        ))}
      </RNView>

      {side.injured.length > 0 ? (
        <RNView style={[styles.injuredCard, { borderColor: c.border, backgroundColor: c.background }]}>
          <RNView style={styles.injuredHeader}>
            <FontAwesome name="medkit" size={14} color={c.negative} />
            <Text style={[styles.injuredTitle, { color: c.text }]}>Not available (injured)</Text>
          </RNView>
          {side.injured.map((p) => (
            <RNView key={`${p.num}-${p.name}`} style={[styles.injuredRow, { borderTopColor: c.border }]}>
              <RNView style={{ flex: 1, minWidth: 0 }}>
                <Text style={[styles.injuredName, { color: c.text }]}>
                  #{p.num} {p.name} · {p.pos}
                </Text>
                <Text style={[styles.injuredStatus, { color: c.negative }]}>{p.status}</Text>
              </RNView>
            </RNView>
          ))}
        </RNView>
      ) : null}
    </RNView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 40 },
  miss: { padding: 24 },
  hero: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 16 },
  heroTop: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 10 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagText: { fontSize: 11, fontWeight: '800' },
  preTipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  preTipPillText: { fontSize: 11, fontWeight: '700' },
  event: { fontSize: 17, fontWeight: '800', marginBottom: 4 },
  scheduledFor: { fontSize: 13, fontWeight: '600', marginBottom: 10 },
  seasonLine: { fontSize: 13, lineHeight: 19, marginBottom: 8 },
  demoNote: { fontSize: 12, lineHeight: 17 },
  tableTitle: { fontSize: 15, fontWeight: '800', marginBottom: 2 },
  tableSub: { fontSize: 12, fontWeight: '600', marginBottom: 8 },
  table: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  tr: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10 },
  trHead: { borderBottomWidth: 1, paddingVertical: 8 },
  thPlayer: { flex: 2.2, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  thNum: { flex: 1, fontSize: 10, fontWeight: '700', textAlign: 'right', textTransform: 'uppercase' },
  playerCell: { flex: 2.2, flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 0 },
  jersey: { fontSize: 11, fontWeight: '700', width: 28 },
  name: { fontSize: 13, fontWeight: '700' },
  pos: { fontSize: 11, marginTop: 2 },
  tdNum: { flex: 1, fontSize: 13, textAlign: 'right' },
  injuredCard: {
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
  injuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  injuredTitle: { fontSize: 13, fontWeight: '800' },
  injuredRow: { paddingVertical: 10, borderTopWidth: StyleSheet.hairlineWidth },
  injuredName: { fontSize: 13, fontWeight: '600' },
  injuredStatus: { fontSize: 12, fontWeight: '700', marginTop: 4 },
});
