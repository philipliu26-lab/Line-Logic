import * as Clipboard from 'expo-clipboard';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View as RNView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/Themed';
import { useApp } from '@/context/AppContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { persistentStorage } from '@/lib/persistentStorage';
import { STORAGE_API_KEY } from '@/lib/storageKeys';

const SAMPLE_JSON = `{
  "pick_id": "1",
  "sport": "NBA",
  "event": "Lakers @ Celtics",
  "line": "Under 224.5",
  "value_score": 72,
  "mock": true
}`;

function makeFakeKey() {
  const part = () => Math.random().toString(36).slice(2, 10);
  return `ll_live_${part()}${part()}`;
}

export default function DeveloperScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const { tier } = useApp();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (tier !== 'elite') return;
    (async () => {
      let k = await persistentStorage.getItem(STORAGE_API_KEY);
      if (!k) {
        k = makeFakeKey();
        await persistentStorage.setItem(STORAGE_API_KEY, k);
      }
      setApiKey(k);
    })();
  }, [tier]);

  const copyKey = async () => {
    if (!apiKey) return;
    await Clipboard.setStringAsync(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (tier !== 'elite') {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={['bottom']}>
        <RNView style={styles.gate}>
          <Text style={[styles.gateTitle, { color: c.text }]}>Elite only</Text>
          <Text style={[styles.gateBody, { color: c.textSecondary }]}>
            API access is part of the Elite plan. Upgrade under Account to view your demo key and sample
            response.
          </Text>
        </RNView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.lead, { color: c.textSecondary }]}>
          Programmatic access (mock). Unlimited queries in this demo means no server-side throttling is
          implemented.
        </Text>

        <Text style={[styles.label, { color: c.muted }]}>API key</Text>
        <RNView style={[styles.keyBox, { backgroundColor: c.surface, borderColor: c.border }]}>
          <Text
            style={[styles.keyText, { color: c.text }]}
            selectable
            accessibilityLabel={`API key ${apiKey ?? 'loading'}`}>
            {apiKey ?? '…'}
          </Text>
          <Pressable
            onPress={copyKey}
            style={({ pressed }) => [
              styles.copyBtn,
              { borderColor: c.accent, opacity: pressed ? 0.8 : 1 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Copy API key">
            <Text style={[styles.copyBtnText, { color: c.accent }]}>{copied ? 'Copied' : 'Copy'}</Text>
          </Pressable>
        </RNView>

        <Text style={[styles.label, { color: c.muted }]}>Sample GET /v1/picks/demo</Text>
        <RNView style={[styles.code, { backgroundColor: c.surface, borderColor: c.border }]}>
          <Text style={[styles.codeText, { color: c.textSecondary }]} selectable>
            {SAMPLE_JSON}
          </Text>
        </RNView>

        <Text style={[styles.foot, { color: c.muted }]}>
          No live endpoint is deployed for this class MVP — the JSON above is static documentation only.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  lead: { fontSize: 14, lineHeight: 21, marginBottom: 20 },
  label: { fontSize: 11, fontWeight: '800', letterSpacing: 0.6, marginBottom: 8, textTransform: 'uppercase' },
  keyBox: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  keyText: { fontSize: 13, fontFamily: 'SpaceMono', marginBottom: 12 },
  copyBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  copyBtnText: { fontWeight: '800', fontSize: 14 },
  code: { borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 16 },
  codeText: { fontSize: 12, lineHeight: 18, fontFamily: 'SpaceMono' },
  foot: { fontSize: 12, lineHeight: 17 },
  gate: { padding: 24 },
  gateTitle: { fontSize: 20, fontWeight: '800', marginBottom: 10 },
  gateBody: { fontSize: 15, lineHeight: 22 },
});
