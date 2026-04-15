export type MockPick = {
  id: string;
  sport: string;
  event: string;
  /** Human-readable start time for demos (e.g. "Tomorrow · 7:10 PM ET"). */
  scheduledFor?: string;
  pick: string;
  note: string;
  valueScore: number;
  breakdown: string[];
  strategicInsight: string;
  odds: { book: string; spread: string; total: string; ml: string }[];
  lineOpen: string;
  lineNow: string;
  lineMoveLabel: string;
  earlyLine?: boolean;
  premiumModel?: boolean;
  injuryNote?: string;
  historicalBlurb: string;
};

/** Three marquee games for presentation — illustrative lines only. */
export const MOCK_PICKS: MockPick[] = [
  {
    id: '1',
    sport: 'NBA',
    event: 'Warriors @ Clippers',
    scheduledFor: 'Wed, Apr 15, 2026 · 7:30 PM PT · ESPN',
    pick: 'Clippers -4.5',
    note: 'Primetime spot: model likes LA’s rim protection vs GSW small-ball lineups (illustrative).',
    valueScore: 71,
    breakdown: [
      'Clippers defensive rating top-5 at home over last 15 (mock window).',
      'Warriors road ORB% dip vs length; pace edges slightly under market total.',
      'Harden/Leonard two-man game frequency up vs switching defenses.',
    ],
    strategicInsight:
      'Watch late Q3 rotation — if Warriors go 5-out, key number is whether Clips stay big.',
    odds: [
      { book: 'Book A', spread: 'LAC -4.5', total: 'o224.5', ml: 'LAC -195' },
      { book: 'Book B', spread: 'LAC -4.0', total: 'o225.0', ml: 'LAC -190' },
      { book: 'Book C', spread: 'LAC -4.5', total: 'o224.0', ml: 'LAC -198' },
    ],
    lineOpen: 'LAC -3.5',
    lineNow: 'LAC -4.5',
    lineMoveLabel: 'Toward Clippers',
    earlyLine: true,
    premiumModel: true,
    injuryNote: 'Warriors wing minutes cap if back-to-back — check status pre-tip (mock).',
    historicalBlurb: 'West playoff-race home favorites -4 to -6: 54% ATS in sample (illustrative).',
  },
  {
    id: '2',
    sport: 'MLB',
    event: 'Dodgers vs Mets',
    scheduledFor: 'Wed, Apr 15, 2026 · 4:05 PM PT · FOX',
    pick: 'Dodgers -1.5 (RL)',
    note: 'Opening-series narrative: LA pen depth vs NYM travel leg (sample).',
    valueScore: 63,
    breakdown: [
      'Starter strikeout profile vs Mets’ top-4 whiff rate vs RHP.',
      'Dodgers bullpen leverage index favorable last turn through rotation.',
      'Weather: mild wind in from RF — small boost to fly-ball profile.',
    ],
    strategicInsight: 'If Mets scratch a late OF, downgrade confidence one tick on RL only.',
    odds: [
      { book: 'Book A', spread: 'LAD -1.5', total: '—', ml: 'LAD -155' },
      { book: 'Book B', spread: 'LAD -1.5', total: '—', ml: 'LAD -150' },
      { book: 'Book C', spread: 'LAD -1.5', total: '—', ml: 'LAD -158' },
    ],
    lineOpen: 'LAD -140',
    lineNow: 'LAD -155',
    lineMoveLabel: 'Toward Dodgers',
    premiumModel: true,
    injuryNote: 'Mets SP2 pitch count watch — 85-90 pitch cap rumor (mock).',
    historicalBlurb: 'Dodgers home RL when favored -140 to -170: ~51% cover (mock sample).',
  },
  {
    id: '3',
    sport: 'MLB',
    event: 'Giants vs Reds',
    scheduledFor: 'Wed, Apr 15, 2026 · 7:10 PM ET',
    pick: 'Under 8.5',
    note: 'Short slate spot: both pens rested; park factors lean under vs RH starters (illustrative).',
    valueScore: 58,
    breakdown: [
      'Combined xFIP band ~3.9; ground-ball tilt in GABP night games.',
      'Bullpen availability: both closers fresh — late scoring suppressed in model.',
      'Vegas total steamed down from 9.0 opener.',
    ],
    strategicInsight: 'If wind shifts out to LF pregame, reassess live total — snapshot is pregame only.',
    odds: [
      { book: 'Book A', spread: 'CIN -1.5', total: 'u8.5', ml: 'SF +120' },
      { book: 'Book B', spread: 'CIN -1.5', total: 'u8.5', ml: 'SF +118' },
      { book: 'Book C', spread: 'CIN -1.5', total: 'u8.5', ml: 'SF +122' },
    ],
    lineOpen: '9.0',
    lineNow: '8.5',
    lineMoveLabel: 'Toward under',
    earlyLine: true,
    historicalBlurb: 'NL Central / West interleague unders when total drops pregame: 56% in mock window.',
  },
];

export function getPickById(id: string): MockPick | undefined {
  return MOCK_PICKS.find((p) => p.id === id);
}
