// app.config.ts
import { defineConfig } from "@tanstack/react-start/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
var app_config_default = defineConfig({
  plugins: [tailwindcss()],
  server: {
    port: 4e3
  }
});
export {
  app_config_default as default
};
