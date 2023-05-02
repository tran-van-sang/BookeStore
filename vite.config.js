import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/BookWorm/",
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    // port: 3001,
    proxy: {
      "/api": {
        // target: "file:///D:/assets/",
        //target: "http://localhost:3000/",
        target: "https://bookstore-3c8x.onrender.com/",
        changeOrigin: true,
      },
    },
  },
})
