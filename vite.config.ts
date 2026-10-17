import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// BASE_PATH permite servir el sitio bajo un subdirectorio (GitHub Pages).
// En local es '/'. En el workflow de GH Pages se inyecta '/<nombre-repo>/'.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  server: {
    port: 5174,
  },
});
