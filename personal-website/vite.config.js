import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// PostCSS (Tailwind + Autoprefixer) is configured in postcss.config.js
export default defineConfig({
  plugins: [react()],
});
