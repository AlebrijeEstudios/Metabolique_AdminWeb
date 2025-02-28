import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname, 'src'),
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    }
  },
  build: {
    outDir: '../dist',
    rollupOptions: {
      external: ['bootstrap']
    }
  },
  assetsInclude: ['**/*.css'],
  server: {
    port: 8080
  }
});
