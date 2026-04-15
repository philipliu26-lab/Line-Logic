/** Graded historical picks for display — demo only. */
export type PastPickResult = {
  id: string;
  sport: string;
  event: string;
  /** Short label e.g. "Mar 28" */
  dateLabel: string;
  /** What we published (short). */
  pick: string;
  correct: boolean;
};

/**
 * Last 20 graded picks: 13 correct, 7 incorrect → 65% hit rate.
 * Mix of ML, spreads, totals (game & team), NBA player points, MLB hits/HR — demo variety.
 * NCAA rows (2026) graded vs official final scores from NCAA.com bracket.
 *
 * @see https://www.ncaa.com/march-madness-live/bracket (2026)
 */
export const PAST_PICK_RESULTS: PastPickResult[] = [
  {
    id: 'p1',
    sport: 'NCAA',
    event: '2026 championship · Michigan 69 vs UConn 63',
    dateLabel: 'Apr 6',
    pick: 'Game total u139.5',
    correct: true,
  },
  {
    id: 'p2',
    sport: 'NCAA',
    event: 'Final Four · UConn 71 vs Illinois 62',
    dateLabel: 'Apr 4',
    pick: 'Illinois ML',
    correct: false,
  },
  {
    id: 'p3',
    sport: 'NCAA',
    event: 'Final Four · Michigan 91 vs Arizona 73',
    dateLabel: 'Apr 4',
    pick: 'Game total o158.5',
    correct: true,
  },
  {
    id: 'p4',
    sport: 'NBA',
    event: 'Nuggets @ Thunder',
    dateLabel: 'Mar 29',
    pick: 'Thunder ML',
    correct: true,
  },
  {
    id: 'p5',
    sport: 'NCAA',
    event: 'Elite 8 · UConn 73 vs Duke 72',
    dateLabel: 'Mar 29',
    pick: 'UConn ML',
    correct: true,
  },
  {
    id: 'p6',
    sport: 'NBA',
    event: 'Knicks @ Heat',
    dateLabel: 'Mar 28',
    pick: 'Game total u214.5',
    correct: true,
  },
  {
    id: 'p7',
    sport: 'NCAA',
    event: 'Elite 8 · Arizona 79 vs Purdue 64',
    dateLabel: 'Mar 28',
    pick: 'Arizona -7.5',
    correct: true,
  },
  {
    id: 'p8',
    sport: 'NBA',
    event: 'Lakers @ Suns',
    dateLabel: 'Mar 27',
    pick: 'Lakers +6.5',
    correct: true,
  },
  {
    id: 'p9',
    sport: 'NCAA',
    event: 'Sweet 16 · Michigan 90 vs Alabama 77',
    dateLabel: 'Mar 27',
    pick: 'Game total o160.5',
    correct: true,
  },
  {
    id: 'p10',
    sport: 'NCAA',
    event: 'Sweet 16 · Purdue 79 vs Texas 77',
    dateLabel: 'Mar 26',
    pick: 'Texas ML',
    correct: false,
  },
  {
    id: 'p11',
    sport: 'NBA',
    event: 'Mavs @ Grizzlies',
    dateLabel: 'Mar 26',
    pick: 'Grizzlies -2.5',
    correct: false,
  },
  {
    id: 'p12',
    sport: 'NBA',
    event: 'Kings @ Warriors',
    dateLabel: 'Mar 25',
    pick: 'Game total o228.5',
    correct: true,
  },
  {
    id: 'p13',
    sport: 'NBA',
    event: 'Timberwolves @ Rockets',
    dateLabel: 'Mar 24',
    pick: 'A. Edwards o/u 27.5 pts · Over',
    correct: true,
  },
  {
    id: 'p14',
    sport: 'MLB',
    event: 'Dodgers vs Padres (opening week)',
    dateLabel: 'Mar 23',
    pick: 'S. Ohtani o/u 1.5 hits · Over',
    correct: false,
  },
  {
    id: 'p15',
    sport: 'NCAA',
    event: 'Round 32 · Iowa 73 vs Florida 72',
    dateLabel: 'Mar 22',
    pick: 'Game total o138.5',
    correct: true,
  },
  {
    id: 'p16',
    sport: 'NBA',
    event: 'Bulls @ Pacers',
    dateLabel: 'Mar 22',
    pick: 'Pacers -5.5',
    correct: false,
  },
  {
    id: 'p17',
    sport: 'NBA',
    event: 'Spurs @ Jazz',
    dateLabel: 'Mar 21',
    pick: 'V. Wembanyama o/u 22.5 pts · Under',
    correct: false,
  },
  {
    id: 'p18',
    sport: 'NCAA',
    event: 'Round 32 · Purdue 79 vs Miami 69',
    dateLabel: 'Mar 21',
    pick: 'Purdue -8.5',
    correct: true,
  },
  {
    id: 'p19',
    sport: 'NCAA',
    event: 'Round 64 · Kentucky 89 vs Santa Clara 84 (OT)',
    dateLabel: 'Mar 20',
    pick: 'Game total o165.5',
    correct: true,
  },
  {
    id: 'p20',
    sport: 'NCAA',
    event: 'Round 64 · VCU 82 vs North Carolina 78 (OT)',
    dateLabel: 'Mar 19',
    pick: 'UNC ML',
    correct: false,
  },
];

export function getPastPickStats(results: PastPickResult[] = PAST_PICK_RESULTS) {
  const total = results.length;
  const wins = results.filter((r) => r.correct).length;
  const pct = total === 0 ? 0 : Math.round((wins / total) * 1000) / 10;
  return { total, wins, losses: total - wins, pct };
}
