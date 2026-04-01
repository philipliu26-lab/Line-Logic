import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { StackHeaderLeading } from '@/components/StackHeaderLeading';
import { useColorScheme } from '@/components/useColorScheme';
import { AppProvider } from '@/context/AppContext';
import Colors from '@/constants/Colors';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AppProvider>
      <RootLayoutNav />
    </AppProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? 'light'];

  const navTheme =
    colorScheme === 'dark'
      ? {
          ...DarkTheme,
          colors: {
            ...DarkTheme.colors,
            background: c.background,
            card: c.surface,
            text: c.text,
            border: c.border,
            primary: c.accent,
          },
        }
      : {
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: c.background,
            card: c.surface,
            text: c.text,
            border: c.border,
            primary: c.accent,
          },
        };

  return (
    <ThemeProvider value={navTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: c.surface },
          headerTintColor: c.text,
          headerTitleStyle: { fontWeight: '700', fontSize: 17, color: c.text },
          headerShadowVisible: false,
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="pick/[id]"
          options={{
            title: 'Pick detail',
            headerBackTitle: 'Back',
            headerLeft: (props) => <StackHeaderLeading navigationProps={props} />,
          }}
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'About' }} />
        <Stack.Screen
          name="developer"
          options={{
            title: 'Developer API',
            headerLeft: (props) => <StackHeaderLeading navigationProps={props} />,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
