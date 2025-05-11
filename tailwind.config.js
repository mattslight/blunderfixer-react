/** @type {import('tailwindcss').Config} */
// tailwind.config.js

import typography from '@tailwindcss/typography';
import flowbite from 'flowbite/plugin';
import { defineConfig } from 'tailwindcss';

/** @type {import('tailwindcss').Config} */
export default defineConfig({
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite/**/*.{js,jsx,ts,tsx}',
  ],
  theme: { extend: {} },
  plugins: [flowbite, typography],
});
