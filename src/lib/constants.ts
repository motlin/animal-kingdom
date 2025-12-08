import type {AnimalRoster, AnimalType} from './types.ts';

export const ANIMAL_ROSTER: Record<AnimalType, AnimalRoster> = {
	Coyote: {
		name: 'Coyote',
		abilityDesc: 'Howl: Puts all other animals to sleep for one turn. Cooldown: 2 turns.',
	},
	Llama: {name: 'Llama', abilityDesc: 'Spitball: An attack with random damage (0-2).'},
	Tiger: {name: 'Tiger', abilityDesc: 'Strike: Hits two different opponents for 1 damage each.'},
	Gorilla: {
		name: 'Gorilla',
		abilityDesc: 'Rampage: A one-time attack that deals 4x damage. Can only be used on turn 5.',
	},
	Monkey: {
		name: 'Monkey',
		abilityDesc: "Mischief: A one-time ability that disables another player's ability permanently.",
	},
	Bird: {
		name: 'Bird',
		abilityDesc:
			'Evasion: Passive ability. Bird only has a 1/3 chance to hit with attacks, and enemies only have a 1/3 chance to hit Bird.',
	},
	Crocodile: {
		name: 'Crocodile',
		abilityDesc:
			'Snap Back: Appears to do nothing, but counters the first attacker for double damage. If unused by next turn, takes 1 damage, loses next turn, and ability is permanently disabled.',
	},
};

export const INITIAL_HP = 3;

export const ANIMAL_EMOJIS: Record<AnimalType, string> = {
	Coyote: '🐺',
	Llama: '🦙',
	Tiger: '🐯',
	Gorilla: '🦍',
	Monkey: '🐒',
	Bird: '🐦',
	Crocodile: '🐊',
};

export const ABILITY_NAMES: Record<AnimalType, string> = {
	Coyote: 'Howl',
	Llama: 'Spitball',
	Tiger: 'Strike',
	Gorilla: 'Rampage',
	Monkey: 'Mischief',
	Bird: 'Evasion',
	Crocodile: 'Snap Back',
};

export const ANIMAL_UNLOCK_ORDER: AnimalType[] = ['Coyote', 'Llama', 'Tiger', 'Gorilla', 'Monkey', 'Bird', 'Crocodile'];

export const TEAM_COLORS: string[] = [
	'#e74c3c', // Red
	'#3498db', // Blue
	'#2ecc71', // Green
	'#f39c12', // Orange
	'#9b59b6', // Purple
	'#1abc9c', // Teal
	'#e91e63', // Pink
	'#795548', // Brown
	'#d2b48c', // Tan
	'#ffeb3b', // Yellow
];
