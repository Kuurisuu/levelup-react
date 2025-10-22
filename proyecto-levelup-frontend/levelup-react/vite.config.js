import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite conexiones externas
    port: 5178, // Puerto actualizado
    strictPort: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'be6f6b7db0f4.ngrok-free.app', // Tu nuevo dominio de ngrok
      '.ngrok-free.app', // Permite cualquier subdominio de ngrok-free.app
      '.ngrok.io' // Permite cualquier subdominio de ngrok.io (por si cambia)
    ]
  }
})
