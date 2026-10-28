import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    svgr({ include: "**/*.svg" }),
    tsconfigPaths(),
  ],

  resolve: {
    dedupe: ["react", "react-dom"],
  },

  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1000,

    minify: "esbuild",
    cssMinify: "esbuild",
  },

  esbuild: {
    drop: ["console", "debugger"],
  },

  server: {
    warmup: {
      clientFiles: ["./app/root.tsx", "./app/routes/**/*.tsx"],
    },
  },

  optimizeDeps: {
    include: ["react", "react-dom", "react-dom/client", "react-router"],
  },
});
