/** @type {import('tailwindcss').Config} */
// tailwind.config.js

import { defineConfig } from 'tailwindcss';
import flowbite from 'flowbite/plugin';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default defineConfig({
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: { extend: {} },
  plugins: [flowbite, typography],
});
