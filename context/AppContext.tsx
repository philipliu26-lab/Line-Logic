import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { MOCK_PICKS } from '@/data/picks';
import { canAccessTier, loadEntitlements, saveEntitlements } from '@/lib/entitlements';
import {
  clampPickUsageToCap,
  dailyLimitForTier,
  effectiveDailyPickCap,
  loadPickUsage,
  savePickUsage,
  type PickUsageState,
  revealNextPick,
  type SubscriptionTier,
} from '@/lib/pickUsage';
import { persistentStorage } from '@/lib/persistentStorage';
import { STORAGE_TIER } from '@/lib/storageKeys';

type AppContextValue = {
  tier: SubscriptionTier;
  /** Switch to an already-owned tier (Base, or a tier you purchased). */
  setTier: (t: SubscriptionTier) => Promise<void>;
  /** Mock checkout: unlocks tier and sets it active. */
  purchaseTier: (t: SubscriptionTier) => Promise<void>;
  canAccessTier: (t: SubscriptionTier) => boolean;
  purchasedTiers: SubscriptionTier[];
  onboardingComplete: boolean;
  completeOnboarding: () => Promise<void>;
  pickUsage: PickUsageState | null;
  refreshPickUsage: () => Promise<void>;
  revealNextPick: () => Promise<{ ok: true } | { ok: false; reason: 'at_limit' }>;
  /** Raw plan limit (3 / 15 / unlimited). */
  planDailyLimit: number;
  /** Enforced cap today: min(plan, catalog size). */
  dailyPickCap: number;
  catalogCount: number;
  ready: boolean;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTierState] = useState<SubscriptionTier>('base');
  const [purchasedTiers, setPurchasedTiersState] = useState<SubscriptionTier[]>(['base']);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [pickUsage, setPickUsage] = useState<PickUsageState | null>(null);
  const [ready, setReady] = useState(false);

  const catalogCount = MOCK_PICKS.length;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [t, usageRaw, ent] = await Promise.all([
          persistentStorage.getItem(STORAGE_TIER),
          loadPickUsage(),
          loadEntitlements(),
        ]);
        if (cancelled) return;
        setPurchasedTiersState(ent);

        let resolvedTier: SubscriptionTier = 'base';
        if (t === 'pro' || t === 'elite' || t === 'base') {
          if (canAccessTier(t, ent)) {
            resolvedTier = t;
          } else {
            await persistentStorage.setItem(STORAGE_TIER, 'base');
          }
        }

        const usage = clampPickUsageToCap(usageRaw, resolvedTier, catalogCount);
        if (
          usage.revealedCount !== usageRaw.revealedCount ||
          usage.dateKey !== usageRaw.dateKey
        ) {
          await savePickUsage(usage);
        }

        if (cancelled) return;
        setTierState(resolvedTier);
        setPickUsage(usage);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /** If tier drops (e.g. Elite → Base), stored reveals can exceed today’s cap — clamp and persist. */
  useEffect(() => {
    if (!ready || !pickUsage) return;
    const cap = effectiveDailyPickCap(tier, catalogCount);
    if (pickUsage.revealedCount <= cap) return;
    const clamped: PickUsageState = { dateKey: pickUsage.dateKey, revealedCount: cap };
    setPickUsage(clamped);
    void savePickUsage(clamped);
  }, [ready, tier, catalogCount, pickUsage]);

  const checkAccess = useCallback(
    (t: SubscriptionTier) => canAccessTier(t, purchasedTiers),
    [purchasedTiers]
  );

  const setTier = useCallback(
    async (t: SubscriptionTier) => {
      if (!canAccessTier(t, purchasedTiers)) return;
      setTierState(t);
      await persistentStorage.setItem(STORAGE_TIER, t);
    },
    [purchasedTiers]
  );

  const purchaseTier = useCallback(
    async (t: SubscriptionTier) => {
      if (t === 'base') {
        await setTier('base');
        return;
      }
      const next = new Set(purchasedTiers);
      next.add(t);
      const list = Array.from(next);
      await saveEntitlements(list);
      setPurchasedTiersState(list);
      setTierState(t);
      await persistentStorage.setItem(STORAGE_TIER, t);
    },
    [purchasedTiers]
  );

  // Intentionally not persisted: each full app load shows the 3 intro slides again.
  const completeOnboarding = useCallback(async () => {
    setOnboardingComplete(true);
  }, []);

  const refreshPickUsage = useCallback(async () => {
    const u = await loadPickUsage();
    setPickUsage(u);
  }, []);

  const doRevealNextPick = useCallback(async () => {
    const result = await revealNextPick(tier, MOCK_PICKS.length);
    if (result.ok) setPickUsage(result.state);
    return result;
  }, [tier]);

  const planDailyLimit = dailyLimitForTier(tier);
  const dailyPickCap = effectiveDailyPickCap(tier, catalogCount);

  const value = useMemo(
    () => ({
      tier,
      setTier,
      purchaseTier,
      canAccessTier: checkAccess,
      purchasedTiers,
      onboardingComplete,
      completeOnboarding,
      pickUsage,
      refreshPickUsage,
      revealNextPick: doRevealNextPick,
      planDailyLimit,
      dailyPickCap,
      catalogCount,
      ready,
    }),
    [
      tier,
      setTier,
      purchaseTier,
      checkAccess,
      purchasedTiers,
      onboardingComplete,
      completeOnboarding,
      pickUsage,
      refreshPickUsage,
      doRevealNextPick,
      planDailyLimit,
      dailyPickCap,
      catalogCount,
      ready,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
