import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View as RNView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { Text } from '@/components/Themed';
import { useApp } from '@/context/AppContext';
import type { SubscriptionTier } from '@/lib/pickUsage';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

type PlanDef = {
  id: SubscriptionTier;
  name: string;
  price: string;
  period: string;
  highlight: boolean;
  features: string[];
};

const PLAN_DEFS: PlanDef[] = [
  {
    id: 'base',
    name: 'Base',
    price: 'FREE',
    period: '',
    highlight: false,
    features: [
      'AI Picks: 3 per day (max catalog size in demo)',
      'Basic Odds Comparison',
      'Line Movement Tracking',
      'Standard Analytics Dashboard',
      'Email Alerts (placeholder)',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$49',
    period: '/ month',
    highlight: true,
    features: [
      'AI Picks: up to 15 per day (capped by catalog in demo)',
      'Advanced Model Breakdowns',
      'Real-Time Line Alerts',
      'Historical Player & Performance data',
      'Value score (AI Pick)',
      'Strategic Insights',
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    price: '$99',
    period: '/ month',
    highlight: false,
    features: [
      'AI Picks: full catalog per day (plan cap vs catalog — demo uses catalog max)',
      'Premium Predictive Models',
      'Early Line Detection',
      'Custom Bet Sizing Recommendations',
      'Player and Injury Analysis',
      'API access and unlimited queries (demo)',
    ],
  },
];

export default function AccountScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const { tier, setTier, canAccessTier, catalogCount } = useApp();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [devPressed, setDevPressed] = useState(false);
  const [ctaPressedKey, setCtaPressedKey] = useState<string | null>(null);

  const onPlanAction = (plan: PlanDef) => {
    if (tier === plan.id) return;
    if (plan.id === 'base') {
      void setTier('base');
      return;
    }
    if (!canAccessTier(plan.id)) {
      router.push(`/purchase/${plan.id}` as Href);
      return;
    }
    void setTier(plan.id);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <DisclaimerBanner />

        <Text style={[styles.pageTitle, { color: c.text }]}>Account</Text>
        <Text style={[styles.pageSub, { color: c.textSecondary }]}>
          Pro and Elite require a mock purchase. You can switch between tiers you already own (Elite can
          switch to Pro) without buying again. This demo has {catalogCount} mocked picks; your daily cap
          is the lower of your plan and that number.
        </Text>

        <RNView style={[styles.rowCard, { backgroundColor: c.surface, borderColor: c.border }]}>
          <RNView style={{ flex: 1 }}>
            <Text style={[styles.rowLabel, { color: c.muted }]}>Email alerts (Base)</Text>
            <Text style={[styles.rowHint, { color: c.textSecondary }]}>
              Placeholder only — no messages are sent in this MVP.
            </Text>
          </RNView>
          <Switch
            value={emailAlerts}
            onValueChange={setEmailAlerts}
            trackColor={{ false: c.border, true: c.accent + '88' }}
            thumbColor="#fff"
            accessibilityLabel="Toggle email alerts placeholder"
          />
        </RNView>

        {tier === 'elite' ? (
          <Pressable
            onPress={() => router.push('/developer')}
            onPressIn={() => setDevPressed(true)}
            onPressOut={() => setDevPressed(false)}
            style={[styles.devBtn, { backgroundColor: c.accent, opacity: devPressed ? 0.9 : 1 }]}
            accessibilityRole="button"
            accessibilityLabel="Open developer API page">
            <FontAwesome name="code" size={18} color="#fff" />
            <Text style={styles.devBtnText}>Developer API & key</Text>
            <FontAwesome name="chevron-right" size={14} color="#fff" />
          </Pressable>
        ) : null}

        <Text style={[styles.title, { color: c.text, marginTop: 8 }]}>Plans</Text>

        {PLAN_DEFS.map((plan) => {
          const current = tier === plan.id;
          const isPaid = plan.id !== 'base';
          const hasAccessToPlan = canAccessTier(plan.id);
          const showPurchase = isPaid && !hasAccessToPlan;
          const label = showPurchase ? 'Purchase' : current ? '' : 'Select';
          const ctaKey = plan.id;

          return (
            <RNView
              key={plan.id}
              style={[
                styles.planCard,
                {
                  backgroundColor: c.surface,
                  borderColor: plan.highlight ? c.accent : c.border,
                  borderWidth: plan.highlight ? 2 : 1,
                },
              ]}>
              {plan.highlight ? (
                <RNView style={[styles.ribbon, { backgroundColor: c.accent }]}>
                  <Text style={styles.ribbonText}>Most popular</Text>
                </RNView>
              ) : null}

              <RNView style={styles.planHeader}>
                <RNView>
                  <Text style={[styles.planName, { color: c.text }]}>
                    {plan.name}
                    <Text style={[styles.planIdx, { color: c.muted }]}>
                      {' '}
                      · {plan.id === 'base' ? '1' : plan.id === 'pro' ? '2' : '3'}
                    </Text>
                  </Text>
                  <RNView style={styles.priceRow}>
                    <Text style={[styles.price, { color: c.text }]}>{plan.price}</Text>
                    {plan.period ? (
                      <Text style={[styles.period, { color: c.muted }]}>{plan.period}</Text>
                    ) : null}
                  </RNView>
                </RNView>
                {current ? (
                  <RNView style={[styles.currentBadge, { backgroundColor: c.background }]}>
                    <Text style={[styles.currentText, { color: c.accent }]}>Current</Text>
                  </RNView>
                ) : (
                  <Pressable
                    onPress={() => onPlanAction(plan)}
                    onPressIn={() => setCtaPressedKey(ctaKey)}
                    onPressOut={() => setCtaPressedKey(null)}
                    style={[
                      showPurchase ? styles.ctaPurchase : styles.cta,
                      {
                        borderColor: c.accent,
                        backgroundColor: showPurchase ? c.accent : 'transparent',
                        opacity: ctaPressedKey === ctaKey ? 0.85 : 1,
                      },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={
                      showPurchase ? `Purchase ${plan.name} plan` : `Select ${plan.name} plan`
                    }>
                    <Text
                      style={[
                        showPurchase ? styles.ctaPurchaseText : styles.ctaText,
                        { color: showPurchase ? '#fff' : c.accent },
                      ]}>
                      {label}
                    </Text>
                  </Pressable>
                )}
              </RNView>

              {plan.features.map((f) => (
                <RNView key={f} style={styles.featRow}>
                  <FontAwesome name="check-circle" size={16} color={c.accent} style={styles.featIcon} />
                  <Text style={[styles.featText, { color: c.textSecondary }]}>{f}</Text>
                </RNView>
              ))}
            </RNView>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  pageTitle: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  pageSub: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
    gap: 12,
  },
  rowLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  rowHint: { fontSize: 13, marginTop: 4, lineHeight: 18 },
  devBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
  },
  devBtnText: { flex: 1, color: '#fff', fontSize: 16, fontWeight: '800' },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
  planCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    overflow: 'hidden',
  },
  ribbon: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  ribbonText: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  planName: { fontSize: 20, fontWeight: '800' },
  planIdx: { fontSize: 14, fontWeight: '600' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 4, gap: 4 },
  price: { fontSize: 26, fontWeight: '800' },
  period: { fontSize: 14, fontWeight: '600' },
  currentBadge: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  currentText: { fontSize: 12, fontWeight: '800' },
  cta: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  ctaPurchase: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  ctaText: { fontSize: 13, fontWeight: '800' },
  ctaPurchaseText: { fontSize: 13, fontWeight: '800' },
  featRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  featIcon: { marginRight: 10, marginTop: 2 },
  featText: { flex: 1, fontSize: 14, lineHeight: 20 },
});
