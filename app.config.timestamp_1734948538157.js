// app.config.ts
import tsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "@tanstack/start/config";
var app_config_default = defineConfig({
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"]
      })
    ]
  }
});
export {
  app_config_default as default
};
