import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import Colors from '@/constants/Colors';
import { useApp } from '@/context/AppContext';
import { useColorScheme } from '@/components/useColorScheme';

export default function Index() {
  const { ready, onboardingComplete } = useApp();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  if (!ready) {
    return (
      <View
        style={[styles.center, { backgroundColor: c.background }]}
        accessibilityLabel="Loading">
        <ActivityIndicator size="large" color={c.accent} />
      </View>
    );
  }

  if (!onboardingComplete) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
