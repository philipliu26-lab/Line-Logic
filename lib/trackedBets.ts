import { persistentStorage } from '@/lib/persistentStorage';
import { STORAGE_TRACKED_BETS } from '@/lib/storageKeys';

export type BetResult = 'win' | 'loss' | 'push' | 'pending';

export type TrackedBet = {
  id: string;
  sport: string;
  event: string;
  pick: string;
  /** American odds (e.g. -110, +135). */
  oddsAmerican: number;
  /** Stake in dollars. */
  stake: number;
  /** When the bet was logged (ms since epoch). */
  placedAt: number;
  result: BetResult;
};

export type BetSummary = {
  tracked: number;
  decided: number;
  wins: number;
  losses: number;
  pushes: number;
  pending: number;
  winPct: number | null;
  profit: number;
  roiPct: number | null;
};

function safeParseBets(raw: string | null): TrackedBet[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(Boolean) as TrackedBet[];
  } catch {
    return [];
  }
}

export function americanToProfitMultiplier(oddsAmerican: number): number {
  if (!Number.isFinite(oddsAmerican) || oddsAmerican === 0) return 0;
  if (oddsAmerican > 0) return oddsAmerican / 100;
  return 100 / Math.abs(oddsAmerican);
}

export function calcBetProfit(bet: TrackedBet): number {
  if (bet.result === 'pending') return 0;
  if (bet.result === 'push') return 0;
  if (bet.result === 'loss') return -bet.stake;
  const mult = americanToProfitMultiplier(bet.oddsAmerican);
  return bet.stake * mult;
}

export function summarizeBets(bets: TrackedBet[]): BetSummary {
  const tracked = bets.length;
  const pending = bets.filter((b) => b.result === 'pending').length;
  const pushes = bets.filter((b) => b.result === 'push').length;
  const wins = bets.filter((b) => b.result === 'win').length;
  const losses = bets.filter((b) => b.result === 'loss').length;
  const decided = wins + losses + pushes;

  const profit = bets.reduce((acc, b) => acc + calcBetProfit(b), 0);
  const stakedOnDecided = bets
    .filter((b) => b.result !== 'pending')
    .reduce((acc, b) => acc + b.stake, 0);

  const winPct = wins + losses > 0 ? wins / (wins + losses) : null;
  const roiPct = stakedOnDecided > 0 ? profit / stakedOnDecided : null;

  return {
    tracked,
    decided,
    wins,
    losses,
    pushes,
    pending,
    winPct,
    profit,
    roiPct,
  };
}

export async function loadTrackedBets(): Promise<TrackedBet[]> {
  const raw = await persistentStorage.getItem(STORAGE_TRACKED_BETS);
  return safeParseBets(raw);
}

export async function saveTrackedBets(bets: TrackedBet[]): Promise<void> {
  await persistentStorage.setItem(STORAGE_TRACKED_BETS, JSON.stringify(bets));
}

export const AI_PICKS_SUGGESTIONS: Array<{ sport: 'NBA' | 'MLB'; event: string; pick: string }> = [
  // NBA (examples)
  { sport: 'NBA', event: 'Celtics @ Knicks', pick: 'Knicks +3.5' },
  { sport: 'NBA', event: 'Bucks @ Heat', pick: 'Under 217.5' },
  { sport: 'NBA', event: 'Suns @ Nuggets', pick: 'Nuggets -5.0' },
  { sport: 'NBA', event: 'Mavericks @ Timberwolves', pick: 'Timberwolves ML' },
  { sport: 'NBA', event: 'Kings @ Lakers', pick: 'Over 231.5' },
  { sport: 'NBA', event: 'Thunder @ Grizzlies', pick: 'Thunder -2.5' },
  { sport: 'NBA', event: '76ers @ Raptors', pick: 'Raptors +4.0' },
  { sport: 'NBA', event: 'Cavaliers @ Pacers', pick: 'Pacers +2.0' },
  { sport: 'NBA', event: 'Bulls @ Hawks', pick: 'Hawks -3.0' },
  { sport: 'NBA', event: 'Pelicans @ Rockets', pick: 'Rockets ML' },

  // MLB (examples)
  { sport: 'MLB', event: 'Yankees vs Red Sox', pick: 'Yankees ML' },
  { sport: 'MLB', event: 'Cubs vs Cardinals', pick: 'Under 8.0' },
  { sport: 'MLB', event: 'Braves vs Phillies', pick: 'Braves -1.5' },
  { sport: 'MLB', event: 'Astros vs Rangers', pick: 'Over 8.5' },
  { sport: 'MLB', event: 'Padres vs Diamondbacks', pick: 'Padres ML' },
  { sport: 'MLB', event: 'Mariners vs Angels', pick: 'Mariners -1.5' },
  { sport: 'MLB', event: 'Blue Jays vs Orioles', pick: 'Orioles ML' },
  { sport: 'MLB', event: 'Brewers vs Reds', pick: 'Under 8.5' },
  { sport: 'MLB', event: 'Twins vs Guardians', pick: 'Guardians +1.5' },
  { sport: 'MLB', event: 'Mets vs Phillies', pick: 'Phillies ML' },
];

export function seedDemoBets(): TrackedBet[] {
  const now = Date.now();
  const [g1, g2, g3] = AI_PICKS_SUGGESTIONS;
  return [
    {
      id: 'b1',
      sport: g1.sport,
      event: g1.event,
      pick: g1.pick,
      oddsAmerican: -110,
      stake: 50,
      placedAt: now - 1000 * 60 * 60 * 2,
      result: 'win',
    },
    {
      id: 'b2',
      sport: g2.sport,
      event: g2.event,
      pick: g2.pick,
      oddsAmerican: +105,
      stake: 40,
      placedAt: now - 1000 * 60 * 60 * 6,
      result: 'loss',
    },
    {
      id: 'b3',
      sport: 'MLB',
      event: 'Yankees vs Angels (Apr 15)',
      pick: 'Yankees ML',
      oddsAmerican: -115,
      stake: 30,
      placedAt: now - 1000 * 60 * 60 * 26,
      result: 'pending',
    },
  ];
}

