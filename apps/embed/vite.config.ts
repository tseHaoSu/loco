import { resolve } from "path"
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "")

  return {
    define: {
      "import.meta.env.VITE_WIDGET_URL": JSON.stringify(env.VITE_WIDGET_URL),
    },
    build: {
    lib: {
      entry: resolve(__dirname, "embed.ts"),
      name: "LocoWidget",
      fileName: "widget",
      formats: ["iife"],
    },
    outDir: "dist",
    minify: true,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        entryFileNames: "widget.js",
      },
    },
  },
  }
})
