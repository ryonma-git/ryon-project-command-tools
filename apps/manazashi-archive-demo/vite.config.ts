import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// GitHub Pages では /ryon-project-command-tools/apps/today-work-selector/ がベースパスになる
export default defineConfig({
  plugins: [react()],
  base: '/ryon-project-command-tools/',
})
