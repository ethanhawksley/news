// @ts-check
import compress from 'astro-compress';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://news.hawksley.dev',
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'always',
    format: 'file',
  },
  integrations: [
    compress({
      Image: false,
      SVG: false,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
    }),
  ],
});
