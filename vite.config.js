// https://vite.dev/config/
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  server: {
    host: true, // same as '0.0.0.0'
    port: 5173,
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
    configureServer(server) {
      // this middleware runs for every request (HTML, JS, WASM, etc.)
      server.middlewares.use((req, res, next) => {
        console.log('Vite middleware:', req.url);
        res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
        next();
      });
    },
  },
  resolve: {
    alias: {
      // whenever flowbite-react does `import ... from 'tailwindcss/version.js'`
      // serve our shim instead
      'tailwindcss/version.js': path.resolve(
        __dirname,
        'tailwindcss-version-shim.js'
      ),
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
