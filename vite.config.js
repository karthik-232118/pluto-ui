import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import polyfillNode from "rollup-plugin-polyfill-node";

export default defineConfig({
  optimizeDeps: {
    exclude: ["react-country-flag"],
    include: ['pdfjs-dist/legacy/build/pdf.worker.js']
  },
  plugins: [
    react(),
    // polyfillNode()
  ],
  define: {
    global: "globalThis",
  },
});
