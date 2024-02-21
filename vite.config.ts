import envOnly from "vite-env-only";
import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { getLoadContext } from "./load-context";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    remixCloudflareDevProxy({
      getLoadContext: getLoadContext,
    }),
    remix(),
    tsconfigPaths(),
    envOnly(),
  ],
});
