import { StyleSheet, ScrollView, View as RNView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const GAME_LINES = [
  { book: 'Book A', spread: '-3.0', total: 'o/u 48.5', ml: '-142' },
  { book: 'Book B', spread: '-2.5', total: 'o/u 48.0', ml: '-138' },
  { book: 'Book C', spread: '-3.0', total: 'o/u 49.0', ml: '-145' },
];

const PLAYER_PROP_GROUPS: {
  title: string;
  subtitle: string;
  rows: { market: string; a: string; b: string; c: string }[];
}[] = [
  {
    title: 'Points (PPG-style game lines)',
    subtitle: 'Season averages vs tonight’s posted O/U — illustrative only.',
    rows: [
      { market: 'L. James o/u 24.5 pts', a: 'o -115', b: 'o -110', c: 'o -118' },
      { market: 'S. Curry o/u 28.5 pts', a: 'u -108', b: 'u -112', c: 'u -105' },
      { market: 'J. Tatum o/u 26.5 pts', a: 'o -105', b: 'o -108', c: 'o -102' },
    ],
  },
  {
    title: 'Rebounds & assists',
    subtitle: 'Same player, different books — spot the soft number.',
    rows: [
      { market: 'G. Antetokounmpo o/u 11.5 reb', a: 'o -120', b: 'o -115', c: 'o -125' },
      { market: 'N. Jokić o/u 9.5 ast', a: 'u -112', b: 'u -108', c: 'u -115' },
      { market: 'L. Dončić o/u 8.5 ast', a: 'o -118', b: 'o -122', c: 'o -114' },
    ],
  },
  {
    title: 'Threes, combos & more',
    subtitle: 'Props beyond the box score — compare before you lock in.',
    rows: [
      { market: 'K. Thompson o/u 3.5 3PM', a: 'o -130', b: 'o -125', c: 'o -128' },
      { market: 'D. Lillard 25+ pts + win', a: '+185', b: '+192', c: '+178' },
      { market: 'A. Edwards alt pts 30+', a: '+145', b: '+140', c: '+150' },
    ],
  },
];

export default function LinesScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <DisclaimerBanner />
        <Text style={[styles.headline, { color: c.text }]}>Odds & line types</Text>
        <Text style={[styles.sub, { color: c.textSecondary }]}>
          Game lines, player props (PPG-style points, boards, dimes, threes), and alts — mocked
          prices to show how Line Logic compares markets side by side.
        </Text>

        <Text style={[styles.sectionTitle, { color: c.text }]}>Game lines</Text>
        <Text style={[styles.sectionSub, { color: c.textSecondary }]}>
          Spread, total, moneyline — same matchup, different numbers.
        </Text>

        <RNView style={[styles.table, { backgroundColor: c.surface, borderColor: c.border }]}>
          <RNView style={[styles.tr, styles.trHead, { borderBottomColor: c.border }]}>
            <Text style={[styles.th, { color: c.muted, flex: 1.2 }]}>Book</Text>
            <Text style={[styles.th, { color: c.muted }]}>Spread</Text>
            <Text style={[styles.th, { color: c.muted }]}>Total</Text>
            <Text style={[styles.th, { color: c.muted }]}>ML</Text>
          </RNView>
          {GAME_LINES.map((row) => (
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

        {PLAYER_PROP_GROUPS.map((group) => (
          <RNView key={group.title}>
            <Text style={[styles.sectionTitle, { color: c.text, marginTop: 8 }]}>{group.title}</Text>
            <Text style={[styles.sectionSub, { color: c.textSecondary }]}>{group.subtitle}</Text>
            <RNView style={[styles.table, { backgroundColor: c.surface, borderColor: c.border }]}>
              <RNView style={[styles.tr, styles.trHead, { borderBottomColor: c.border }]}>
                <Text style={[styles.th, { color: c.muted, flex: 1.4 }]}>Market</Text>
                <Text style={[styles.th, { color: c.muted }]}>A</Text>
                <Text style={[styles.th, { color: c.muted }]}>B</Text>
                <Text style={[styles.th, { color: c.muted }]}>C</Text>
              </RNView>
              {group.rows.map((row) => (
                <RNView key={row.market} style={[styles.tr, { borderBottomColor: c.border }]}>
                  <Text style={[styles.tdSm, { color: c.text, flex: 1.4, fontWeight: '600' }]}>
                    {row.market}
                  </Text>
                  <Text style={[styles.tdSm, { color: c.text }]}>{row.a}</Text>
                  <Text style={[styles.tdSm, { color: c.accent, fontWeight: '700' }]}>{row.b}</Text>
                  <Text style={[styles.tdSm, { color: c.text }]}>{row.c}</Text>
                </RNView>
              ))}
            </RNView>
          </RNView>
        ))}

        <Text style={[styles.sectionTitle, { color: c.text }]}>Line movement</Text>
        <Text style={[styles.sectionSub, { color: c.textSecondary }]}>
          Opening → current with move direction (sample timeline).
        </Text>

        <RNView style={[styles.moveCard, { backgroundColor: c.surface, borderColor: c.border }]}>
          <RNView style={styles.moveHeader}>
            <Text style={[styles.moveEvent, { color: c.text }]}>Spread · Chiefs @ Bills</Text>
            <RNView style={[styles.pill, { backgroundColor: c.positive + '22' }]}>
              <Text style={[styles.pillText, { color: c.positive }]}>Toward Bills</Text>
            </RNView>
          </RNView>
          <RNView style={styles.sparkRow}>
            {[40, 55, 48, 62, 58, 72, 68, 80, 75, 88].map((h, i) => (
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
            <Text style={[styles.moveMeta, { color: c.muted }]}>Open -1.5 → Now -2.5</Text>
            <Text style={[styles.moveMeta, { color: c.muted }]}>Updated 2m ago</Text>
          </RNView>
        </RNView>

        <RNView style={[styles.moveCard, { backgroundColor: c.surface, borderColor: c.border }]}>
          <RNView style={styles.moveHeader}>
            <Text style={[styles.moveEvent, { color: c.text }]}>Prop · Curry o/u 28.5 pts</Text>
            <RNView style={[styles.pill, { backgroundColor: c.accent + '22' }]}>
              <Text style={[styles.pillText, { color: c.accent }]}>Toward over</Text>
            </RNView>
          </RNView>
          <RNView style={styles.sparkRow}>
            {[35, 42, 40, 48, 52, 58, 55, 62, 68, 72].map((h, i) => (
              <RNView
                key={i}
                style={[
                  styles.sparkBar,
                  {
                    height: h * 0.35,
                    backgroundColor: i > 5 ? c.accent : c.muted + '66',
                  },
                ]}
              />
            ))}
          </RNView>
          <RNView style={styles.moveFooter}>
            <Text style={[styles.moveMeta, { color: c.muted }]}>Open 27.5 → Now 28.5</Text>
            <Text style={[styles.moveMeta, { color: c.muted }]}>Updated 18m ago</Text>
          </RNView>
        </RNView>

        <RNView style={[styles.hint, { backgroundColor: c.accent + '14', borderColor: c.accent + '44' }]}>
          <Text style={[styles.hintText, { color: c.textSecondary }]}>
            Real-time line alerts and early steam detection ship on Pro and Elite — game lines and
            props included in the demo model.
          </Text>
        </RNView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 28 },
  headline: { fontSize: 20, fontWeight: '800', marginBottom: 6 },
  sub: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  table: { borderRadius: 14, borderWidth: 1, overflow: 'hidden', marginBottom: 20 },
  tr: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12 },
  trHead: { borderBottomWidth: 1 },
  th: { flex: 1, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  td: { flex: 1, fontSize: 14 },
  tdSm: { flex: 1, fontSize: 12, lineHeight: 16 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  sectionSub: { fontSize: 13, marginBottom: 12, lineHeight: 18 },
  moveCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 16 },
  moveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  moveEvent: { fontSize: 14, fontWeight: '700', flex: 1, paddingRight: 8 },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  pillText: { fontSize: 11, fontWeight: '800' },
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
  moveMeta: { fontSize: 12 },
  hint: { borderRadius: 12, borderWidth: 1, padding: 12 },
  hintText: { fontSize: 13, lineHeight: 19 },
});
