import type {GameState, Player} from './types.ts';
import {INITIAL_HP} from './constants.ts';
import {saveUnlockedAnimals} from './storage.ts';

export let state: GameState;
export let stateHistory: GameState[] = [];
export let unlockedAnimals: Set<string>;

export function setUnlockedAnimals(animals: Set<string>): void {
	unlockedAnimals = animals;
}

export function initializeState(players: Player[]): void {
	const randomFirstPlayerIndex = Math.floor(Math.random() * players.length);

	state = {
		players,
		currentPlayerIndex: randomFirstPlayerIndex,
		gameState: 'playing',
		turn: 1,
		actionInProgress: null,
		turnSkipped: false,
		log: [],
	};

	stateHistory = [];
}

export function saveStateToHistory(): void {
	const stateCopy = JSON.parse(JSON.stringify(state)) as GameState;
	stateHistory.push(stateCopy);
}

export function restorePreviousState(): void {
	const previousState = stateHistory.pop();
	if (previousState) {
		state = JSON.parse(JSON.stringify(previousState)) as GameState;
	}
}

export function logMessage(message: string, indent = 0): void {
	state.log.push({message, indent});
}

export function unlockAnimal(animalName: string): void {
	if (!unlockedAnimals.has(animalName)) {
		unlockedAnimals.add(animalName);
		saveUnlockedAnimals(unlockedAnimals as Set<never>);
	}
}

export function createPlayer(
	id: number,
	name: string,
	animal: string,
	isComputer: boolean,
): Player {
	let initialHP = INITIAL_HP;
	if (animal === 'Gorilla') {
		initialHP = 4;
	}

	return {
		id,
		name,
		animal: animal as never,
		hp: initialHP,
		maxHp: initialHP,
		isAlive: true,
		isComputer,
		status: {
			isShielded: false,
			isSleeping: false,
		},
		oneTimeActions: {
			hasHealed: false,
			hasShielded: false,
			hasUsedAbility: false,
		},
		abilityCooldown: 0,
		abilityDisabled: false,
	};
}
