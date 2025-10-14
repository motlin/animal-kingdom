import {useState, useEffect, useCallback} from 'react';
import type {AnimalType} from '../types.ts';
import {
	loadUnlockedAnimals as loadUnlockedAnimalsFromStorage,
	saveUnlockedAnimals as saveUnlockedAnimalsToStorage,
	loadTheme as loadThemeFromStorage,
	saveTheme as saveThemeToStorage,
	loadMutePreference as loadMutePreferenceFromStorage,
	saveMutePreference as saveMutePreferenceToStorage,
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
			if (event.key === 'animalKingdomUnlockedAnimals' && event.newValue) {
				setUnlockedAnimalsState(new Set(JSON.parse(event.newValue) as AnimalType[]));
			} else if (event.key === 'animalKingdomTheme' && event.newValue) {
				setThemeState(event.newValue === 'dark' ? 'dark' : 'light');
			} else if (event.key === 'animalKingdomMuted' && event.newValue) {
				setIsMutedState(event.newValue === 'true');
			}
		};

		window.addEventListener('storage', handleStorageChange);
		return () => window.removeEventListener('storage', handleStorageChange);
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
