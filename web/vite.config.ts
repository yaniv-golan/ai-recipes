import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import yaml from '@rollup/plugin-yaml'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    yaml()
  ],
  base: '/ai-recipes/',
  publicDir: path.resolve(__dirname, 'public'),
  server: {
    fs: {
      allow: ['..']
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    }
  }
})