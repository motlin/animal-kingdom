import type {AnimalType} from './types.ts';

const UNLOCKED_ANIMALS_KEY = 'animalKingdomUnlockedAnimals';
const THEME_KEY = 'animalKingdomTheme';
const MUTED_KEY = 'animalKingdomMuted';

export function loadUnlockedAnimals(): Set<AnimalType> {
	const saved = localStorage.getItem(UNLOCKED_ANIMALS_KEY);
	if (saved) {
		return new Set(JSON.parse(saved) as AnimalType[]);
	}
	return new Set(['Coyote'] as AnimalType[]);
}

export function saveUnlockedAnimals(animals: Set<AnimalType>): void {
	localStorage.setItem(UNLOCKED_ANIMALS_KEY, JSON.stringify([...animals]));
}

export function loadTheme(): 'light' | 'dark' {
	const savedTheme = localStorage.getItem(THEME_KEY);
	return savedTheme === 'dark' ? 'dark' : 'light';
}

export function saveTheme(theme: 'light' | 'dark'): void {
	localStorage.setItem(THEME_KEY, theme);
}

export function loadMutePreference(): boolean {
	const savedMute = localStorage.getItem(MUTED_KEY);
	return savedMute === 'true';
}

export function saveMutePreference(muted: boolean): void {
	localStorage.setItem(MUTED_KEY, muted.toString());
}
