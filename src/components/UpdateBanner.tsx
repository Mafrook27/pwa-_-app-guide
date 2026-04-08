import { useVersionCheck } from '@/hooks/useVersionCheck';
import { AlertCircle, X, RefreshCw } from 'lucide-react';

export default function UpdateBanner() {
  const { updateAvailable, currentVersion, serverVersion, dismissUpdate, reloadApp } = useVersionCheck();

  if (!updateAvailable) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium">A new version is available!</p>
              <p className="text-sm text-blue-100">
                Please refresh to get the latest updates.
                {serverVersion && (
                  <span className="ml-2 text-xs">
                    (v{currentVersion} → v{serverVersion})
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={reloadApp}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Now
            </button>
            <button
              onClick={dismissUpdate}
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
