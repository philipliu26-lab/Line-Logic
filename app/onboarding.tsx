import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View as RNView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LineLogicGlyph } from '@/components/LineLogicGlyph';
import { Text } from '@/components/Themed';
import { useApp } from '@/context/AppContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const GLYPH = 44;
const GLYPH_H = (GLYPH * 78) / 120;

const SLIDES = [
  {
    title: 'Decisions you can defend',
    body: 'Replace gut-feel with a clear story: lines, movement, and context on screen.',
  },
  {
    title: 'Proof over vibes',
    body: 'Compare books and line moves. Picks follow daily limits that match your plan.',
  },
  {
    title: 'Depth when you want it',
    body: 'Base, Pro, and Elite add more picks and insight — this build uses mock data only.',
  },
];

export default function OnboardingScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const { completeOnboarding } = useApp();
  const [page, setPage] = useState(0);
  const [ctaPressed, setCtaPressed] = useState(false);

  const finish = async () => {
    await completeOnboarding();
    router.replace('/(tabs)');
  };

  const slide = SLIDES[page];
  const isLast = page === SLIDES.length - 1;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={['top', 'bottom']}>
      <RNView style={styles.inner}>
        <RNView style={styles.topBar}>
          {!isLast ? (
            <Pressable onPress={finish} hitSlop={12} accessibilityRole="button" accessibilityLabel="Skip">
              <Text style={[styles.skip, { color: c.muted }]}>Skip</Text>
            </Pressable>
          ) : (
            <RNView />
          )}
        </RNView>

        <RNView style={styles.main}>
          <RNView style={styles.markWrap} accessibilityLabel="Line Logic">
            <LineLogicGlyph color={c.text} width={GLYPH} height={GLYPH_H} />
          </RNView>

          <Text style={[styles.step, { color: c.muted }]}>
            {page + 1} / {SLIDES.length}
          </Text>

          <Text style={[styles.title, { color: c.text }]} accessibilityRole="header">
            {slide.title}
          </Text>
          <Text style={[styles.body, { color: c.textSecondary }]}>{slide.body}</Text>
        </RNView>

        <RNView style={styles.footer}>
          <Text style={[styles.disclaimer, { color: c.muted }]}>
            Educational prototype · Not gambling or financial advice
          </Text>
          <Pressable
            onPress={isLast ? finish : () => setPage((p) => p + 1)}
            onPressIn={() => setCtaPressed(true)}
            onPressOut={() => setCtaPressed(false)}
            style={[styles.cta, { opacity: ctaPressed ? 0.65 : 1 }]}
            accessibilityRole="button"
            accessibilityLabel={isLast ? 'Get started' : 'Next'}>
            <Text style={[styles.ctaText, { color: c.accent }]}>
              {isLast ? 'Get started' : 'Next'}
            </Text>
          </Pressable>
        </RNView>
      </RNView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: {
    flex: 1,
    paddingHorizontal: 32,
    paddingBottom: 8,
  },
  topBar: {
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  skip: {
    fontSize: 15,
    fontWeight: '500',
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 24,
  },
  markWrap: {
    alignSelf: 'flex-start',
    marginBottom: 28,
    opacity: 0.92,
  },
  step: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: -0.5,
    lineHeight: 34,
    marginBottom: 12,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    maxWidth: 320,
  },
  footer: {
    paddingTop: 8,
    paddingBottom: 12,
    gap: 20,
  },
  disclaimer: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
  },
  cta: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '600',
  },
});
