import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";
import { execSync } from "child_process";

// Get Git commit hash for version tracking
let commitHash: string;
try {
  commitHash = execSync("git rev-parse --short HEAD").toString().trim();
} catch (error) {
  // Fallback if not in a git repository
  commitHash = "dev-" + Date.now();
  console.warn("Git not available, using fallback version:", commitHash);
}

console.log("Building with version:", commitHash);

export default defineConfig({
  base: '/guides/',
  plugins: [
    react(),
    tailwindcss(),
  ],

  define: {
    __APP_VERSION__: JSON.stringify(commitHash),
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  server: {
    proxy: {
      // Uncomment and set target when you have a real backend:
      // "/api": {
      //   target: "http://localhost:3001",
      //   changeOrigin: true,
      // },
    },
  },
})