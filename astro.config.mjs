// @ts-check
import { defineConfig } from 'astro/config';

// Site estático, sem framework de UI. A URL final entra na sessão 8.
export default defineConfig({
  output: 'static',
  trailingSlash: 'ignore',
  // CSS embutido no HTML: sem requisições bloqueando a renderização (LCP mobile).
  build: { format: 'directory', inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
});
