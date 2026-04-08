/**
 * Version logging utility
 * Logs version information to console for debugging
 */

export function logVersionInfo() {
  const styles = {
    title: 'color: #3b82f6; font-weight: bold; font-size: 14px;',
    version: 'color: #10b981; font-weight: bold;',
    info: 'color: #6b7280;',
  };

  console.log('%c🔄 Version Check System', styles.title);
  console.log('%cFrontend Version:', styles.info, `%c${__APP_VERSION__}`, styles.version);
  console.log('%cPolling Interval:', styles.info, '5 minutes');
  console.log('%cEndpoint:', styles.info, '/api/version');
  console.log('%cTest Page:', styles.info, '/version-test');
  
  // Check if version endpoint is accessible
  fetch('/api/version')
    .then(res => res.json())
    .then(data => {
      console.log('%cBackend Version:', styles.info, `%c${data.version}`, styles.version);
      
      if (data.version === __APP_VERSION__) {
        console.log('%c✅ Versions Match', 'color: #10b981; font-weight: bold;');
      } else {
        console.log('%c⚠️ Version Mismatch Detected!', 'color: #ef4444; font-weight: bold;');
        console.log('%cUpdate banner should appear', styles.info);
      }
    })
    .catch(err => {
      console.log('%c❌ Backend version endpoint not available', 'color: #ef4444;');
      console.log('%cError:', styles.info, err.message);
      console.log('%cSetup backend /api/version endpoint', styles.info);
    });
}

// Auto-log on app start (only in development)
if (import.meta.env.DEV) {
  logVersionInfo();
}
