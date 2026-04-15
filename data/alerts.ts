export type LineAlert = {
  id: string;
  title: string;
  body: string;
  timeLabel: string;
  sport: string;
};

import { MOCK_PICKS } from '@/data/picks';

const TIME_LABELS = ['2m ago', '14m ago', '1h ago', '3h ago', 'Yesterday'];

/** Demo alerts based on the current featured games in `data/picks.ts`. */
export const LINE_ALERTS: LineAlert[] = [
  ...MOCK_PICKS.map((p, idx): LineAlert => {
    const timeLabel = TIME_LABELS[idx] ?? `${idx + 1}h ago`;
    const move = p.lineOpen && p.lineNow ? `${p.lineOpen} → ${p.lineNow}` : p.lineMoveLabel;
    return {
      id: `pick-${p.id}`,
      sport: p.sport,
      title: `Line move: ${p.event}`,
      body: `${move}. Pick: ${p.pick}.`,
      timeLabel,
    };
  }),
  // A couple of generic “system” events still tied to the slate.
  {
    id: 'meta-early',
    sport: 'Market',
    title: 'Early lines posted',
    body: 'Lookahead lines refreshed for today’s featured slate.',
    timeLabel: TIME_LABELS[MOCK_PICKS.length] ?? '4h ago',
  },
  {
    id: 'meta-roster',
    sport: 'Model',
    title: 'Roster context updated',
    body: 'Lineups are synced to each team’s most recent game; stats shown are season-to-date.',
    timeLabel: TIME_LABELS[MOCK_PICKS.length + 1] ?? '6h ago',
  },
];
