import { persistentStorage } from '@/lib/persistentStorage';
import { STORAGE_PICK_USAGE } from '@/lib/storageKeys';

export type SubscriptionTier = 'base' | 'pro' | 'elite';

export type PickUsageState = {
  dateKey: string;
  revealedCount: number;
};

function localDateKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function dailyLimitForTier(tier: SubscriptionTier): number {
  if (tier === 'base') return 3;
  if (tier === 'pro') return 15;
  return 9999;
}

export async function loadPickUsage(): Promise<PickUsageState> {
  const today = localDateKey();
  try {
    const raw = await persistentStorage.getItem(STORAGE_PICK_USAGE);
    if (!raw) return { dateKey: today, revealedCount: 0 };
    const parsed = JSON.parse(raw) as PickUsageState;
    if (parsed.dateKey !== today) {
      return { dateKey: today, revealedCount: 0 };
    }
    return {
      dateKey: parsed.dateKey,
      revealedCount: Math.max(0, Number(parsed.revealedCount) || 0),
    };
  } catch {
    return { dateKey: today, revealedCount: 0 };
  }
}

export async function savePickUsage(state: PickUsageState): Promise<void> {
  await persistentStorage.setItem(STORAGE_PICK_USAGE, JSON.stringify(state));
}

/** Resets at local calendar midnight by comparing date keys (device local time). */
export async function revealNextPick(
  tier: SubscriptionTier,
  maxPicksInCatalog: number
): Promise<{ ok: true; state: PickUsageState } | { ok: false; reason: 'at_limit' }> {
  const limit = dailyLimitForTier(tier);
  const usage = await loadPickUsage();
  const today = localDateKey();
  const state: PickUsageState =
    usage.dateKey !== today ? { dateKey: today, revealedCount: 0 } : usage;

  const cap = Math.min(limit, maxPicksInCatalog);
  if (state.revealedCount >= cap) {
    return { ok: false, reason: 'at_limit' };
  }

  const next: PickUsageState = {
    dateKey: today,
    revealedCount: state.revealedCount + 1,
  };
  await savePickUsage(next);
  return { ok: true, state: next };
}
