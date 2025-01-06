import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Optional: If you need to resolve SVGs from specific directories
    alias: {
      '@/assets/icons': path.resolve(__dirname, './src/assets/icons'),
    },
  },
})
