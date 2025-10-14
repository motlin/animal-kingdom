import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {renderHook, act} from '@testing-library/react';
import {useStorage} from './useStorage.ts';
import type {AnimalType} from '../types.ts';

function mockLocalStorage() {
	const store: Record<string, string> = {};

	return {
		getItem: vi.fn((key: string) => store[key] || null),
		setItem: vi.fn((key: string, value: string) => {
			store[key] = value;
		}),
		clear: vi.fn(() => {
			Object.keys(store).forEach((key) => delete store[key]);
		}),
	};
}

describe('useStorage', () => {
	let localStorageMock: ReturnType<typeof mockLocalStorage>;

	beforeEach(() => {
		localStorageMock = mockLocalStorage();
		Object.defineProperty(window, 'localStorage', {
			value: localStorageMock,
			writable: true,
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('unlockedAnimals', () => {
		it('initializes with Coyote when no saved data exists', () => {
			const {result} = renderHook(() => useStorage());

			expect(result.current.unlockedAnimals.has('Coyote')).toBe(true);
			expect(result.current.unlockedAnimals.size).toBe(1);
		});

		it('loads saved unlocked animals from localStorage', () => {
			localStorageMock.setItem('animalKingdomUnlockedAnimals', JSON.stringify(['Coyote', 'Llama', 'Tiger']));

			const {result} = renderHook(() => useStorage());

			expect(result.current.unlockedAnimals.has('Coyote')).toBe(true);
			expect(result.current.unlockedAnimals.has('Llama')).toBe(true);
			expect(result.current.unlockedAnimals.has('Tiger')).toBe(true);
			expect(result.current.unlockedAnimals.size).toBe(3);
		});

		it('saves unlocked animals to localStorage', () => {
			const {result} = renderHook(() => useStorage());

			const newAnimals = new Set<AnimalType>(['Coyote', 'Llama', 'Tiger', 'Gorilla']);

			act(() => {
				result.current.setUnlockedAnimals(newAnimals);
			});

			expect(localStorageMock.setItem).toHaveBeenCalledWith(
				'animalKingdomUnlockedAnimals',
				JSON.stringify(['Coyote', 'Llama', 'Tiger', 'Gorilla']),
			);
			expect(result.current.unlockedAnimals).toEqual(newAnimals);
		});

		it('updates unlocked animals on storage event', () => {
			const {result} = renderHook(() => useStorage());

			const storageEvent = new StorageEvent('storage', {
				key: 'animalKingdomUnlockedAnimals',
				newValue: JSON.stringify(['Coyote', 'Monkey']),
			});

			act(() => {
				window.dispatchEvent(storageEvent);
			});

			expect(result.current.unlockedAnimals.has('Coyote')).toBe(true);
			expect(result.current.unlockedAnimals.has('Monkey')).toBe(true);
			expect(result.current.unlockedAnimals.size).toBe(2);
		});
	});

	describe('theme', () => {
		it('initializes with light theme when no saved data exists', () => {
			const {result} = renderHook(() => useStorage());

			expect(result.current.theme).toBe('light');
		});

		it('loads saved theme from localStorage', () => {
			localStorageMock.setItem('animalKingdomTheme', 'dark');

			const {result} = renderHook(() => useStorage());

			expect(result.current.theme).toBe('dark');
		});

		it('saves theme to localStorage', () => {
			const {result} = renderHook(() => useStorage());

			act(() => {
				result.current.setTheme('dark');
			});

			expect(localStorageMock.setItem).toHaveBeenCalledWith('animalKingdomTheme', 'dark');
			expect(result.current.theme).toBe('dark');
		});

		it('updates theme on storage event', () => {
			const {result} = renderHook(() => useStorage());

			const storageEvent = new StorageEvent('storage', {
				key: 'animalKingdomTheme',
				newValue: 'dark',
			});

			act(() => {
				window.dispatchEvent(storageEvent);
			});

			expect(result.current.theme).toBe('dark');
		});

		it('defaults to light theme for invalid values', () => {
			localStorageMock.setItem('animalKingdomTheme', 'invalid');

			const {result} = renderHook(() => useStorage());

			expect(result.current.theme).toBe('light');
		});
	});

	describe('isMuted', () => {
		it('initializes with false when no saved data exists', () => {
			const {result} = renderHook(() => useStorage());

			expect(result.current.isMuted).toBe(false);
		});

		it('loads saved mute preference from localStorage', () => {
			localStorageMock.setItem('animalKingdomMuted', 'true');

			const {result} = renderHook(() => useStorage());

			expect(result.current.isMuted).toBe(true);
		});

		it('saves mute preference to localStorage', () => {
			const {result} = renderHook(() => useStorage());

			act(() => {
				result.current.setIsMuted(true);
			});

			expect(localStorageMock.setItem).toHaveBeenCalledWith('animalKingdomMuted', 'true');
			expect(result.current.isMuted).toBe(true);
		});

		it('updates mute preference on storage event', () => {
			const {result} = renderHook(() => useStorage());

			const storageEvent = new StorageEvent('storage', {
				key: 'animalKingdomMuted',
				newValue: 'true',
			});

			act(() => {
				window.dispatchEvent(storageEvent);
			});

			expect(result.current.isMuted).toBe(true);
		});
	});

	describe('storage event cleanup', () => {
		it('removes event listener on unmount', () => {
			const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
			const {unmount} = renderHook(() => useStorage());

			unmount();

			expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));
		});
	});
});
