import type { SubscriptionTier } from '@/lib/pickUsage';
import { persistentStorage } from '@/lib/persistentStorage';
import { STORAGE_ENTITLEMENTS, STORAGE_TIER } from '@/lib/storageKeys';

/** Base is always available. Elite implies access to Pro-level switching. */
export function canAccessTier(
  target: SubscriptionTier,
  purchased: SubscriptionTier[]
): boolean {
  if (target === 'base') return true;
  if (purchased.includes(target)) return true;
  if (target === 'pro' && purchased.includes('elite')) return true;
  return false;
}

export async function loadEntitlements(): Promise<SubscriptionTier[]> {
  try {
    const raw = await persistentStorage.getItem(STORAGE_ENTITLEMENTS);
    if (raw) {
      const parsed = JSON.parse(raw) as SubscriptionTier[];
      if (Array.isArray(parsed) && parsed.length) {
        const s = new Set<SubscriptionTier>(['base', ...parsed]);
        return Array.from(s);
      }
    }
  } catch {
    /* migrate below */
  }

  const legacyTier = await persistentStorage.getItem(STORAGE_TIER);
  const migrated = new Set<SubscriptionTier>(['base']);
  if (legacyTier === 'pro') migrated.add('pro');
  if (legacyTier === 'elite') migrated.add('elite');
  const arr = Array.from(migrated);
  await persistentStorage.setItem(STORAGE_ENTITLEMENTS, JSON.stringify(arr));
  return arr;
}

export async function saveEntitlements(tiers: SubscriptionTier[]): Promise<void> {
  const s = new Set<SubscriptionTier>(['base', ...tiers]);
  await persistentStorage.setItem(STORAGE_ENTITLEMENTS, JSON.stringify(Array.from(s)));
}
