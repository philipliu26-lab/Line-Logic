export type LineAlert = {
  id: string;
  title: string;
  body: string;
  timeLabel: string;
  sport: string;
};

export const MOCK_ALERTS: LineAlert[] = [
  {
    id: 'a1',
    title: 'Steam: Chiefs @ Bills total',
    body: 'Total ticked 48.0 → 47.5 on three books in 6 minutes (mock).',
    timeLabel: '2m ago',
    sport: 'NFL',
  },
  {
    id: 'a2',
    title: 'Spread move: Lakers @ Celtics',
    body: 'Celtics -4.5 now widely available vs -4.0 opener (illustrative).',
    timeLabel: '14m ago',
    sport: 'NBA',
  },
  {
    id: 'a3',
    title: 'Early line posted',
    body: 'Elite: lookahead total posted 12h earlier than usual window (demo flag).',
    timeLabel: '1h ago',
    sport: 'NBA',
  },
  {
    id: 'a4',
    title: 'Injury watch',
    body: 'Secondary ball-handler questionable — model confidence downgraded on pace props (mock).',
    timeLabel: '3h ago',
    sport: 'NBA',
  },
];
