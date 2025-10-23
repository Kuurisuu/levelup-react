import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

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
});
