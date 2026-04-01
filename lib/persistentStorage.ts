import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * In-memory fallback when the native AsyncStorage module is unavailable
 * (e.g. some Expo Go + New Architecture combinations: "Native module is null").
 */
const memory = new Map<string, string>();

export const persistentStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return memory.get(key) ?? null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch {
      memory.set(key, value);
    }
  },
};
