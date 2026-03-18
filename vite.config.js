import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: '/DIVAS-in-Tech/',
    plugins: [react()],
    server: {
    historyApiFallback: true
  }
})