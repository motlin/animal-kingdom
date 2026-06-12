import {useState, useEffect, useCallback} from 'react';
import type {AnimalType} from '../lib/types.ts';
import {
	loadUnlockedAnimals as loadUnlockedAnimalsFromStorage,
	saveUnlockedAnimals as saveUnlockedAnimalsToStorage,
	loadTheme as loadThemeFromStorage,
	saveTheme as saveThemeToStorage,
	loadMutePreference as loadMutePreferenceFromStorage,
	saveMutePreference as saveMutePreferenceToStorage,
	isAnimalType,
} from '../storage.ts';

export interface UseStorageReturn {
	unlockedAnimals: Set<AnimalType>;
	setUnlockedAnimals: (animals: Set<AnimalType>) => void;
	theme: 'light' | 'dark';
	setTheme: (theme: 'light' | 'dark') => void;
	isMuted: boolean;
	setIsMuted: (muted: boolean) => void;
}

export function useStorage(): UseStorageReturn {
	const [unlockedAnimals, setUnlockedAnimalsState] = useState<Set<AnimalType>>(() =>
		loadUnlockedAnimalsFromStorage(),
	);
	const [theme, setThemeState] = useState<'light' | 'dark'>(() => loadThemeFromStorage());
	const [isMuted, setIsMutedState] = useState<boolean>(() => loadMutePreferenceFromStorage());

	const setUnlockedAnimals = useCallback((animals: Set<AnimalType>) => {
		setUnlockedAnimalsState(animals);
		saveUnlockedAnimalsToStorage(animals);
	}, []);

	const setTheme = useCallback((newTheme: 'light' | 'dark') => {
		setThemeState(newTheme);
		saveThemeToStorage(newTheme);
	}, []);

	const setIsMuted = useCallback((muted: boolean) => {
		setIsMutedState(muted);
		saveMutePreferenceToStorage(muted);
	}, []);

	useEffect(() => {
		const handleStorageChange = (event: StorageEvent) => {
			const newValue = event.newValue;
			if (newValue === null || newValue === '') {
				return;
			}
			if (event.key === 'animalKingdomUnlockedAnimals') {
				const parsed: unknown = JSON.parse(newValue);
				if (Array.isArray(parsed)) {
					setUnlockedAnimalsState(new Set<AnimalType>(parsed.filter(isAnimalType)));
				}
			} else if (event.key === 'animalKingdomTheme') {
				setThemeState(newValue === 'dark' ? 'dark' : 'light');
			} else if (event.key === 'animalKingdomMuted') {
				setIsMutedState(newValue === 'true');
			}
		};

		window.addEventListener('storage', handleStorageChange);
		return () => {
			window.removeEventListener('storage', handleStorageChange);
		};
	}, []);

	return {
		unlockedAnimals,
		setUnlockedAnimals,
		theme,
		setTheme,
		isMuted,
		setIsMuted,
	};
}
