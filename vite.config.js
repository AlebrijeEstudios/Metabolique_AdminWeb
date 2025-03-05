import { resolve } from 'path'
import dotenv from 'dotenv';

const path = require('path')

export default {
  root: path.resolve(__dirname, 'src'),
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    }
  },
  build: {
    outDir: '../dist'
  },
  server: {
    port: 8080,
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
    'import.meta.env.VITE_API_URL_TEST': JSON.stringify(process.env.VITE_API_URL_TEST),
    'import.meta.env.VITE_API_KEY': JSON.stringify(process.env.VITE_API_KEY),
  }
}