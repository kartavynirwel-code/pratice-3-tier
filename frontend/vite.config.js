import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// envDir '..' lets Vite read VITE_* values from the root .env
export default defineConfig({
  plugins: [react()],
  envDir: "..",
  server: { host: true, port: 5173 },
});
