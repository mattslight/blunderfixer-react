// https://vite.dev/config/
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // same as '0.0.0.0'
    port: 5173,
  },
  resolve: {
    alias: {
      // whenever flowbite-react does `import ... from 'tailwindcss/version.js'`
      // serve our shim instead
      'tailwindcss/version.js': path.resolve(
        __dirname,
        'tailwindcss-version-shim.js'
      ),
    },
  },
});
