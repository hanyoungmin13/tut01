import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/tut01/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        member: resolve(__dirname, 'member.html')
      }
    }
  }
});
