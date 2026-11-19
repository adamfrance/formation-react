/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // un faux navigateur (DOM) dans Node.js
    globals: true, // describe, it, expect disponibles partout ; Testing Library nettoie après chaque test
    setupFiles: ['./src/setupTests.ts'], // exécuté avant chaque fichier de test
    coverage: {
      include: ['src/**/*.{ts,tsx}'], // tous les fichiers de l'application, même ceux qu'aucun test n'ouvre
      exclude: ['src/main.tsx', 'src/types.ts', 'src/mocks/**', 'src/test/**', 'src/data/**'], // pas du code à tester
      thresholds: { lines: 60 }, // en dessous de 60 % des lignes, la commande échoue
    },
  },
})
