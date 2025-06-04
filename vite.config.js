import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        joc: resolve(__dirname, 'joc.html'),
        opcions: resolve(__dirname, 'opcions.html'),
        instructions: resolve(__dirname, 'instructions.html'),
        adeu: resolve(__dirname, 'adeu.html'),
      }
    }
  }
})