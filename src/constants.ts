import type {AnimalRoster, AnimalType} from './types.ts';

export const ANIMAL_ROSTER: Record<AnimalType, AnimalRoster> = {
	Coyote: {
		name: 'Coyote',
		abilityDesc: 'Howl: Puts all other animals to sleep for one turn. Cooldown: 2 turns.',
	},
	Llama: {name: 'Llama', abilityDesc: 'Spitball: An attack with random damage (0-2).'},
	Tiger: {name: 'Tiger', abilityDesc: 'Strike: Hits two different opponents for 1 damage each.'},
	Gorilla: {name: 'Gorilla', abilityDesc: 'Rampage: A one-time attack that deals 4x damage. Can only be used on turn 5.'},
	Monkey: {
		name: 'Monkey',
		abilityDesc: "Mischief: A one-time ability that disables another player's ability permanently.",
	},
};

export const INITIAL_HP = 3;

export const ANIMAL_EMOJIS: Record<AnimalType, string> = {
	Coyote: '🐺',
	Llama: '🦙',
	Tiger: '🐯',
	Gorilla: '🦍',
	Monkey: '🐒',
};

export const ABILITY_NAMES: Record<AnimalType, string> = {
	Coyote: 'Howl',
	Llama: 'Spitball',
	Tiger: 'Strike',
	Gorilla: 'Rampage',
	Monkey: 'Mischief',
};
