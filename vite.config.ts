import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      // entry: 'src/duration-input.ts',
      // entry: 'src/numeric-input.ts',
      entry: 'src/duration-input.ts',
      formats: ['es']
    },
    rollupOptions: {
      external: /^lit/
    }
  }
})
