import {defineConfig} from 'vite';
import {resolve} from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	base: process.env['VITE_BASE_PATH'] || '/',
	root: '.',
	build: {
		outDir: 'dist',
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
			},
		},
		sourcemap: true,
	},
	server: {
		port: 3000,
	},
});
