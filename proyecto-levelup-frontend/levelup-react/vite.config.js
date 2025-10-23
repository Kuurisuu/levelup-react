import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5178,
    strictPort: true,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "be6f6b7db0f4.ngrok-free.app",
      ".ngrok-free.app",
      ".ngrok.io",
    ],
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "dist", "build"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.spec.ts",
        "**/*.spec.tsx",
        "**/vite-env.d.ts",
        "**/main.tsx",
        "**/App.tsx",
      ],
    },
    setupFiles: ["./src/tests/setup.ts"],
  },
});
