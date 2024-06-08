import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@/components": "/src/components",
      "@/context": "/src/context",
      "@/db": "/src/db",
      "@/hooks": "/src/hooks",
      "@/types": "/src/types",
      "@/views": "/src/views",
      "@/utils": "/src/utils",
    },
  },
  server: {
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
});
