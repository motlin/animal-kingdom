import {defineConfig, defineProject, mergeConfig} from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			projects: [
				defineProject({
					test: {
						name: 'unit',
						globals: true,
						environment: 'jsdom',
						setupFiles: ['./vitest.setup.ts'],
					},
				}),
			],
		},
	}),
);
