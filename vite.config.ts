import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    base: "/discman-portfolio-playback/",
  },
  tanstackStart: {
    server: { entry: "server" },
    spa: {
      enabled: true,
    },
  },
});