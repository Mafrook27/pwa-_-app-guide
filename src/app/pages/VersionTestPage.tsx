import { useVersionCheck } from '@/hooks/useVersionCheck';
import { CheckCircle, XCircle, RefreshCw, Info } from 'lucide-react';

export default function VersionTestPage() {
  const { updateAvailable, currentVersion, serverVersion, reloadApp } = useVersionCheck();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Version Check Test Page</h1>

        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              {updateAvailable ? (
                <XCircle className="w-6 h-6 text-red-500" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
              <h2 className="text-xl font-semibold">
                {updateAvailable ? 'Update Available' : 'Up to Date'}
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Current Version (Frontend):</span>
                <code className="px-3 py-1 bg-gray-100 rounded font-mono text-sm">
                  {currentVersion}
                </code>
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Server Version (Backend):</span>
                <code className="px-3 py-1 bg-gray-100 rounded font-mono text-sm">
                  {serverVersion || 'Loading...'}
                </code>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Status:</span>
                <span className={`px-3 py-1 rounded font-medium ${
                  updateAvailable 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {updateAvailable ? 'Mismatch Detected' : 'Versions Match'}
                </span>
              </div>
            </div>

            {updateAvailable && (
              <button
                onClick={reloadApp}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                <RefreshCw className="w-5 h-5" />
                Reload Application
              </button>
            )}
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm text-blue-900">
                <p className="font-medium">How it works:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Frontend version is baked into the build from Git commit hash</li>
                  <li>Backend exposes current version via <code className="px-1 bg-blue-100 rounded">/api/version</code></li>
                  <li>Frontend polls every 5 minutes to check for updates</li>
                  <li>When versions don't match, update banner appears</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Testing Instructions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Testing Instructions</h3>
            
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Method 1: Mock Version (Quick)</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-2">
                  <li>Edit <code className="px-1 bg-gray-100 rounded">public/api/version.json</code></li>
                  <li>Change the version to something different</li>
                  <li>Refresh this page - banner should appear</li>
                </ol>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Method 2: Backend Server (Full Test)</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-2">
                  <li>Start the example server: <code className="px-1 bg-gray-100 rounded">cd server-example && npm start</code></li>
                  <li>Set initial version in <code className="px-1 bg-gray-100 rounded">.env</code></li>
                  <li>Change the version and restart server</li>
                  <li>Wait 5 minutes or refresh - banner appears</li>
                </ol>
              </div>

              <div className="pt-4 border-t">
                <p className="text-gray-600">
                  📚 Full documentation: <code className="px-1 bg-gray-100 rounded">docs/VERSION_CHECKING.md</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
