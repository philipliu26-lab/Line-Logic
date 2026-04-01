import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { MOCK_PICKS } from '@/data/picks';
import {
  dailyLimitForTier,
  loadPickUsage,
  type PickUsageState,
  revealNextPick,
  type SubscriptionTier,
} from '@/lib/pickUsage';
import { persistentStorage } from '@/lib/persistentStorage';
import { STORAGE_ONBOARDING, STORAGE_TIER } from '@/lib/storageKeys';

type AppContextValue = {
  tier: SubscriptionTier;
  setTier: (t: SubscriptionTier) => Promise<void>;
  onboardingComplete: boolean;
  completeOnboarding: () => Promise<void>;
  pickUsage: PickUsageState | null;
  refreshPickUsage: () => Promise<void>;
  revealNextPick: () => Promise<{ ok: true } | { ok: false; reason: 'at_limit' }>;
  dailyLimit: number;
  catalogCount: number;
  ready: boolean;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTierState] = useState<SubscriptionTier>('base');
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [pickUsage, setPickUsage] = useState<PickUsageState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [t, ob, usage] = await Promise.all([
          persistentStorage.getItem(STORAGE_TIER),
          persistentStorage.getItem(STORAGE_ONBOARDING),
          loadPickUsage(),
        ]);
        if (cancelled) return;
        if (t === 'pro' || t === 'elite' || t === 'base') setTierState(t);
        setOnboardingComplete(ob === 'true');
        setPickUsage(usage);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setTier = useCallback(async (t: SubscriptionTier) => {
    setTierState(t);
    await persistentStorage.setItem(STORAGE_TIER, t);
  }, []);

  const completeOnboarding = useCallback(async () => {
    await persistentStorage.setItem(STORAGE_ONBOARDING, 'true');
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

  const dailyLimit = dailyLimitForTier(tier);

  const value = useMemo(
    () => ({
      tier,
      setTier,
      onboardingComplete,
      completeOnboarding,
      pickUsage,
      refreshPickUsage,
      revealNextPick: doRevealNextPick,
      dailyLimit,
      catalogCount: MOCK_PICKS.length,
      ready,
    }),
    [
      tier,
      setTier,
      onboardingComplete,
      completeOnboarding,
      pickUsage,
      refreshPickUsage,
      doRevealNextPick,
      dailyLimit,
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
