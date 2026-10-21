// @ts-check
import { defineConfig } from 'astro/config';

// Site estático, sem framework de UI. A URL final entra na sessão 8.
export default defineConfig({
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
