import {defineConfig, defineProject, mergeConfig} from 'vitest/config';
import {storybookTest} from '@storybook/addon-vitest/vitest-plugin';
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
				defineProject({
					plugins: [
						storybookTest({
							configDir: '.storybook',
							storybookScript: 'npm run storybook -- --ci',
						}),
					],
					test: {
						name: 'storybook',
						browser: {
							enabled: true,
							name: 'chromium',
							provider: 'playwright',
							headless: true,
						},
						setupFiles: ['./.storybook/vitest.setup.ts'],
					},
				}),
			],
		},
	}),
);
