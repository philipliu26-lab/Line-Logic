import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View as RNView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/Themed';
import { useApp } from '@/context/AppContext';
import type { SubscriptionTier } from '@/lib/pickUsage';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const CHECKOUT: Record<
  Exclude<SubscriptionTier, 'base'>,
  { name: string; line: string; blurb: string }
> = {
  pro: {
    name: 'Pro',
    line: '$49.00 / month',
    blurb: 'Up to 15 AI pick reveals per day (capped by catalog in this demo), line alerts, and value scores.',
  },
  elite: {
    name: 'Elite',
    line: '$99.00 / month',
    blurb: 'Full catalog daily cap, premium models, developer API access in this build — all mock data.',
  },
};

export default function CheckoutScreen() {
  const params = useLocalSearchParams<{ tier: string }>();
  const tier =
    params.tier === 'pro' || params.tier === 'elite' ? (params.tier as 'pro' | 'elite') : null;

  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const { purchaseTier, canAccessTier, ready } = useApp();
  const [busy, setBusy] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [nameOnCard, setNameOnCard] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  useEffect(() => {
    if (tier == null) {
      router.replace('/(tabs)/plans');
    }
  }, [tier]);

  useEffect(() => {
    if (!ready || !tier) return;
    if (canAccessTier(tier)) {
      router.replace('/(tabs)/plans');
    }
  }, [ready, tier, canAccessTier]);

  const onCompletePurchase = async () => {
    if (!tier || !agreed || busy) return;
    setBusy(true);
    try {
      await purchaseTier(tier);
      router.replace('/(tabs)/plans');
    } finally {
      setBusy(false);
    }
  };

  if (!tier) {
    return (
      <RNView style={[styles.center, { backgroundColor: c.background }]}>
        <ActivityIndicator color={c.accent} />
      </RNView>
    );
  }

  const meta = CHECKOUT[tier];
  const canPay = agreed && nameOnCard.trim().length > 0 && cardNumber.trim().length >= 4;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text style={[styles.kicker, { color: c.muted }]}>Checkout (demo)</Text>
        <Text style={[styles.title, { color: c.text }]}>{meta.name}</Text>
        <Text style={[styles.price, { color: c.accent }]}>{meta.line}</Text>
        <Text style={[styles.blurb, { color: c.textSecondary }]}>{meta.blurb}</Text>

        <RNView style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
          <Text style={[styles.sectionLabel, { color: c.muted }]}>Payment (mock)</Text>
          <Text style={[styles.hint, { color: c.textSecondary }]}>
            No real card is charged. Enter any name and a fake card number for the demo.
          </Text>
          <Text style={[styles.fieldLabel, { color: c.muted }]}>Name on card</Text>
          <TextInput
            value={nameOnCard}
            onChangeText={setNameOnCard}
            placeholder="Alex Demo"
            placeholderTextColor={c.muted}
            style={[styles.input, { color: c.text, borderColor: c.border, backgroundColor: c.background }]}
            autoCapitalize="words"
            autoCorrect={false}
            accessibilityLabel="Name on card"
          />
          <Text style={[styles.fieldLabel, { color: c.muted }]}>Card number</Text>
          <TextInput
            value={cardNumber}
            onChangeText={setCardNumber}
            placeholder="4242 4242 4242 4242"
            placeholderTextColor={c.muted}
            keyboardType="number-pad"
            style={[styles.input, { color: c.text, borderColor: c.border, backgroundColor: c.background }]}
            accessibilityLabel="Card number mock"
          />
        </RNView>

        <Pressable
          onPress={() => setAgreed(!agreed)}
          style={styles.rowAgree}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: agreed }}
          accessibilityLabel="I understand this is a mock purchase">
          <RNView
            style={[
              styles.checkbox,
              { borderColor: c.border, backgroundColor: agreed ? c.accent : 'transparent' },
            ]}>
            {agreed ? <Text style={styles.checkMark}>✓</Text> : null}
          </RNView>
          <Text style={[styles.agreeText, { color: c.textSecondary }]}>
            I understand this is a class demo — no real payment is processed.
          </Text>
        </Pressable>

        <Pressable
          onPress={onCompletePurchase}
          disabled={!canPay || busy}
          style={[
            styles.payBtn,
            { backgroundColor: canPay && !busy ? c.accent : c.muted, opacity: busy ? 0.85 : 1 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Complete mock purchase">
          {busy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payBtnText}>Pay {meta.line.replace(' / month', '')} — mock</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.back()} style={styles.cancelBtn} accessibilityRole="button">
          <Text style={[styles.cancelText, { color: c.muted }]}>Cancel</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: 20, paddingBottom: 40 },
  kicker: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 4 },
  price: { fontSize: 22, fontWeight: '800', marginBottom: 12 },
  blurb: { fontSize: 15, lineHeight: 22, marginBottom: 20 },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  hint: { fontSize: 13, lineHeight: 18, marginBottom: 14 },
  fieldLabel: { fontSize: 12, fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 14,
  },
  rowAgree: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 20 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkMark: { color: '#fff', fontSize: 12, fontWeight: '900' },
  agreeText: { flex: 1, fontSize: 14, lineHeight: 20 },
  payBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  payBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  cancelBtn: { alignSelf: 'center', paddingVertical: 8 },
  cancelText: { fontSize: 16, fontWeight: '600' },
});
