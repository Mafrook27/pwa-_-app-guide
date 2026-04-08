import { AppRouter } from "./router";
import UpdateBanner from "@/components/UpdateBanner";
import "@/lib/versionLogger"; // Auto-logs version info in dev mode

function App() {
  return (
    <>
      <UpdateBanner />
      <AppRouter />
    </>
  );
}

export default App;
