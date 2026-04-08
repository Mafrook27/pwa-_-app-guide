import { useEffect, useState } from 'react';

const POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes
const VERSION_ENDPOINT = '/api/version';

export function useVersionCheck() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [currentVersion] = useState(__APP_VERSION__);
  const [serverVersion, setServerVersion] = useState<string | null>(null);

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const response = await fetch(VERSION_ENDPOINT);
        const data = await response.json();
        
        setServerVersion(data.version);

        if (data.version !== currentVersion) {
          console.log('Version mismatch detected:', {
            current: currentVersion,
            server: data.version,
          });
          setUpdateAvailable(true);
          window.dispatchEvent(new CustomEvent('app-update-available', {
            detail: {
              currentVersion,
              serverVersion: data.version,
            }
          }));
        }
      } catch (error) {
        console.error('Failed to check version:', error);
      }
    };

    // Check immediately on mount
    checkVersion();

    // Then poll every 5 minutes
    const interval = setInterval(checkVersion, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [currentVersion]);

  const dismissUpdate = () => {
    setUpdateAvailable(false);
  };

  const reloadApp = () => {
    window.location.reload();
  };

  return {
    updateAvailable,
    currentVersion,
    serverVersion,
    dismissUpdate,
    reloadApp,
  };
}
