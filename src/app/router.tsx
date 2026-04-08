import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SimpleLayout from "./layout/SimpleLayout";
import FormEditorPage from "./pages/FormEditorPage";
import EmailEditorPage from "./pages/EmailEditorPage";
import InlineEmailComposerPage from "./pages/InlineEmailComposerPage";
import VersionTestPage from "./pages/VersionTestPage";

// Guide pages
import PWAAppGuide from "./pages/PWA_app_guide_v2";
import PortalGuide from "./pages/portal_visual_guide";

const router = createBrowserRouter([
  {
    element: <SimpleLayout />,
    children: [
      {
        path: "/",
        element: <PWAAppGuide />,
      },
      {
        path: "/pwa-app",
        element: <PWAAppGuide />,
      },
      {
        path: "/portal",
        element: <PortalGuide />,
      },
      {
        path: "/version-test",
        element: <VersionTestPage />,
      },
    ],
  },
  {
    path: "/form-editor",
    element: <FormEditorPage />,
  },
  {
    path: "/email-editor",
    element: <EmailEditorPage />,
  },
  {
    path: "/inline-email-composer",
    element: <InlineEmailComposerPage />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
