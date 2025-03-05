import { resolve } from 'path'
/*import dotenv from 'dotenv';

dotenv.config();

process.env.VITE_API_URL;
process.env.VITE_API_URL_TEST;
process.env.VITE_API_KEY;*/

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
  }
}