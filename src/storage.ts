import type {AnimalType} from './lib/types.ts';

const ALL_ANIMALS: readonly AnimalType[] = ['Coyote', 'Llama', 'Tiger', 'Gorilla', 'Monkey', 'Bird', 'Crocodile'];

export function isAnimalType(value: unknown): value is AnimalType {
	return typeof value === 'string' && (ALL_ANIMALS as readonly string[]).includes(value);
}

const UNLOCKED_ANIMALS_KEY = 'animalKingdomUnlockedAnimals';
const THEME_KEY = 'animalKingdomTheme';
const MUTED_KEY = 'animalKingdomMuted';

export function loadUnlockedAnimals(): Set<AnimalType> {
	const saved = localStorage.getItem(UNLOCKED_ANIMALS_KEY);
	if (saved !== null && saved !== '') {
		const parsed: unknown = JSON.parse(saved);
		if (Array.isArray(parsed)) {
			return new Set<AnimalType>(parsed.filter(isAnimalType));
		}
	}
	return new Set<AnimalType>(['Coyote']);
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
