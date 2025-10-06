import js from '@eslint/js';
import globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import type {Linter} from 'eslint';

const config: Linter.Config[] = [
	{ignores: ['dist', 'build', '.llm/**']},
	{
		files: ['vite.config.ts', 'vitest.config.ts'],
		languageOptions: {
			globals: {
				process: 'readonly',
			},
		},
	},
	{
		files: ['**/*.test.{js,ts}', '**/*.spec.{js,ts}', '**/setupTests.{js,ts}'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.jest,
				vi: 'readonly',
				expect: 'readonly',
				it: 'readonly',
				describe: 'readonly',
				beforeEach: 'readonly',
				afterEach: 'readonly',
			},
		},
	},
	{
		files: ['**/*.js'],
		languageOptions: {
			ecmaVersion: 2020,
			globals: {
				...globals.browser,
				...globals.jest,
			},
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},
		rules: {
			...js.configs.recommended.rules,
			'no-unused-vars': ['error', {varsIgnorePattern: '^[A-Z_]'}],
			eqeqeq: ['error', 'smart'],
			'one-var': ['error', 'never'],
		},
	},
	{
		files: ['**/*.ts'],
		languageOptions: {
			ecmaVersion: 2020,
			globals: {
				...globals.browser,
				...globals.jest,
			},
			parser: tsparser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				project: './tsconfig.json',
			},
		},
		plugins: {
			'@typescript-eslint': tseslint as any,
		},
		rules: {
			...(tseslint.configs?.['recommended']?.rules || {}),
			'@typescript-eslint/no-unused-vars': ['error', {varsIgnorePattern: '^[A-Z_]'}],
			'@typescript-eslint/no-explicit-any': 'off',
			eqeqeq: ['error', 'smart'],
			'one-var': ['error', 'never'],
		},
	},
];

export default config;
