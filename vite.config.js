import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        reports: resolve(__dirname, 'reports.html'),
        storeReport: resolve(__dirname, 'store-report.html')
      }
    }
  }
});