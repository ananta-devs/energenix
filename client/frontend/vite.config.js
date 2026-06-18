import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(),
    tailwindcss(),
    svgr()
  ],
  server: {
    proxy: {
      '/api': {
        // target: 'https://energenix-client.onrender.com/api',
        target: 'http://localhost:4000/api',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
})
