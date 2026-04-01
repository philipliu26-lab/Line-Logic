/**
 * Web (static GitHub Pages): persistence uses the browser’s localStorage only.
 * Each visitor has their own origin storage — nothing is written to a shared server,
 * and there is no cross-user global Map (see default persistentStorage for native).
 *
 * During static prerender / SSR, `window` is undefined — reads return null and writes
 * no-op so build output is not polluted by shared in-memory state.
 */
export const persistentStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (typeof window === 'undefined') return null;
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(key, value);
    } catch {
      /* Quota, private mode, or storage disabled — fail silently; app still runs in-memory */
    }
  },
};
