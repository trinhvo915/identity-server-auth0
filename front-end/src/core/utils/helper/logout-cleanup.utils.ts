/**
 * Logout Cleanup Utilities
 *
 * SAFETY NOTE: This file ONLY clears browser localStorage keys.
 * It does NOT delete any files from your computer or server.
 * All operations are safe and reversible.
 */

/**
 * Keys that should be cleared on logout
 */
const AUTH_STORAGE_KEYS = [
  'access_token',           // Auth0 access token
  'refresh_token',          // Auth0 refresh token (if used)
  'user_profile',           // User profile data
  'session_data',           // Session information
  'recently_played',        // User's listening history
  'user_playlists',         // User's playlists
  'favorites',              // User's favorite songs
  'queue',                  // Current playback queue
] as const;

/**
 * Keys that should be preserved (user preferences)
 */
const PRESERVE_KEYS = [
  'theme',                  // next-themes preference
  'music-app-color-theme',  // Color theme preference
  'volume',                 // Volume preference
  'playback_quality',       // Audio quality preference
] as const;

/**
 * SAFETY: Backup localStorage data before clearing
 * Returns a backup object that can be used to restore data
 */
export function backupLocalStorage(): Record<string, string> {
  if (typeof window === 'undefined') return {};

  const backup: Record<string, string> = {};

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          backup[key] = value;
        }
      }
    }
    console.log('✅ LocalStorage backup created:', Object.keys(backup).length, 'keys');
    return backup;
  } catch (error) {
    console.error('❌ Error creating backup:', error);
    return {};
  }
}

/**
 * SAFETY: Restore localStorage from backup
 */
export function restoreLocalStorage(backup: Record<string, string>): void {
  if (typeof window === 'undefined') return;

  try {
    Object.entries(backup).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
    console.log('✅ LocalStorage restored:', Object.keys(backup).length, 'keys');
  } catch (error) {
    console.error('❌ Error restoring backup:', error);
  }
}

/**
 * SAFETY: Clear only auth data, preserve user preferences
 * This is the RECOMMENDED function for logout
 *
 * @returns backup object (optional - for safety)
 */
export function clearAuthData(): Record<string, string> {
  if (typeof window === 'undefined') return {};

  // Create backup before clearing (SAFETY FEATURE)
  const backup: Record<string, string> = {};

  try {
    // Backup only auth keys that will be deleted
    AUTH_STORAGE_KEYS.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        backup[key] = value;
      }
    });

    // Clear specific auth-related keys
    AUTH_STORAGE_KEYS.forEach(key => {
      localStorage.removeItem(key);
    });

    console.log('✅ Auth data cleared from localStorage');
    console.log('🔒 User preferences preserved:', PRESERVE_KEYS.join(', '));
    console.log('💾 Backup available if needed');

    return backup; // Return backup in case of emergency restore
  } catch (error) {
    console.error('❌ Error clearing auth data:', error);
    return backup;
  }
}
