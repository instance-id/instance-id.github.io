import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

export default defineConfig({
  site: 'https://instance.id',
  output: 'static',
  integrations: [svelte()],
  vite: {
    server: {
      host: true,
    },
  },
});
