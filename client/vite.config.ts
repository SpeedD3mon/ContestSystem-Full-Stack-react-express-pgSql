import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    hmr: {
      // The browser will open WS to this host:port.
      // Use 'localhost' when you open http://localhost:3000 in your browser.
      host: 'localhost',
      port: 3000,
      protocol: 'ws'
    },
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    watch: {
      // Polling gives more reliable file change detection under Docker mounts
      usePolling: true,
      interval: 100
    }
  },
});