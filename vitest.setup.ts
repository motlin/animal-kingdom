import {beforeEach} from 'vitest';

beforeEach(() => {
	const localStorageMock = (() => {
		let store: Record<string, string> = {};

		return {
			getItem: (key: string): string | null => {
				return store[key] ?? null;
			},
			setItem: (key: string, value: string): void => {
				store[key] = value.toString();
			},
			removeItem: (key: string): void => {
				delete store[key];
			},
			clear: (): void => {
				store = {};
			},
		};
	})();

	Object.defineProperty(globalThis, 'localStorage', {
		value: localStorageMock,
		writable: true,
	});
});
