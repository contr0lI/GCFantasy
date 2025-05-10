import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173, // Port de développement par défaut de Vite
    open: true, // Ouvre automatiquement le navigateur au démarrage
  },
  build: {
    outDir: 'dist', // Dossier de sortie pour la build de production
    sourcemap: true, // Génère des sourcemaps pour le débogage en production
  },
});