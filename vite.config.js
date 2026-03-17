import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  //配置代理服务器(与resolve平级)
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          secure: false,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''), //  路径重写
        }
      }
    }
})
