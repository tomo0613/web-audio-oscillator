import vite_react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
    base: '/web-audio-oscillator',
    server: {
        open: true,
    },
    plugins: [
        vite_react(),
    ],
    esbuild: {
        jsxInject: 'import React from "react"',
    },
});
