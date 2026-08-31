import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/ai': {
        target: 'https://tabitoken.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ai/, '/v1'),
        secure: true,
      },
      '/api/ar': {
        target: 'https://agentrouter.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ar/, '/v1'),
        secure: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('User-Agent', 'RooCode/3.0.0');
          });
        },
      },
      '/api/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/api/agentrouter': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
