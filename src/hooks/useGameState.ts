import {useState, useCallback} from 'react';
import type {GameState, Player, AnimalType, GameMode, Team} from '../lib/types.ts';
import {INITIAL_HP, ANIMAL_UNLOCK_ORDER} from '../lib/constants.ts';

export interface UseGameStateReturn {
	state: GameState;
	stateHistory: GameState[];
	unlockedAnimals: Set<string>;
	setUnlockedAnimals: (animals: Set<string>) => void;
	initializeState: (players: Player[], gameMode?: GameMode, teams?: Team[]) => void;
	saveStateToHistory: () => void;
	restorePreviousState: () => void;
	logMessage: (message: string, indent?: number) => void;
	unlockAnimal: (animalName: string) => void;
	getNextLockedAnimal: () => AnimalType | null;
	createPlayer: (id: number, name: string, animal: string, isComputer: boolean, teamId?: number) => Player;
	updateState: (updater: (state: GameState) => void) => void;
}

interface StateWithHistory {
	current: GameState;
	history: GameState[];
}

export function useGameState(): UseGameStateReturn {
	const [stateWithHistory, setStateWithHistory] = useState<StateWithHistory>({
		current: {
			players: [],
			teams: [],
			currentPlayerIndex: 0,
			gameState: 'playing',
			gameMode: 'standard',
			turn: 1,
			actionInProgress: null,
			turnSkipped: false,
			log: [],
		},
		history: [],
	});

	const [unlockedAnimals, setUnlockedAnimalsState] = useState<Set<string>>(new Set());

	const setUnlockedAnimals = useCallback((animals: Set<string>) => {
		setUnlockedAnimalsState(animals);
	}, []);

	const initializeState = useCallback((players: Player[], gameMode: GameMode = 'standard', teams: Team[] = []) => {
		const randomFirstPlayerIndex = Math.floor(Math.random() * players.length);

		setStateWithHistory({
			current: {
				players,
				teams,
				currentPlayerIndex: randomFirstPlayerIndex,
				gameState: 'playing',
				gameMode,
				turn: 1,
				actionInProgress: null,
				turnSkipped: false,
				log: [],
			},
			history: [],
		});
	}, []);

	const saveStateToHistory = useCallback(() => {
		setStateWithHistory((prev) => {
			const stateCopy = JSON.parse(JSON.stringify(prev.current)) as GameState;
			return {
				current: prev.current,
				history: [...prev.history, stateCopy],
			};
		});
	}, []);

	const restorePreviousState = useCallback(() => {
		setStateWithHistory((prev) => {
			if (prev.history.length === 0) {
				return prev;
			}
			const newHistory = [...prev.history];
			const previousState = newHistory.pop();
			if (previousState) {
				return {
					current: JSON.parse(JSON.stringify(previousState)) as GameState,
					history: newHistory,
				};
			}
			return prev;
		});
	}, []);

	const logMessage = useCallback((message: string, indent = 0) => {
		setStateWithHistory((prev) => {
			const clonedState = JSON.parse(JSON.stringify(prev.current)) as GameState;
			clonedState.log.push({message, indent});
			return {
				...prev,
				current: clonedState,
			};
		});
	}, []);

	const unlockAnimal = useCallback((animalName: string) => {
		setUnlockedAnimalsState((current) => {
			if (!current.has(animalName)) {
				const updated = new Set(current);
				updated.add(animalName);
				return updated;
			}
			return current;
		});
	}, []);

	const getNextLockedAnimal = useCallback((): AnimalType | null => {
		for (const animal of ANIMAL_UNLOCK_ORDER) {
			if (!unlockedAnimals.has(animal)) {
				return animal;
			}
		}
		return null;
	}, [unlockedAnimals]);

	const createPlayer = useCallback(
		(id: number, name: string, animal: string, isComputer: boolean, teamId?: number): Player => {
			let initialHP = INITIAL_HP;
			if (animal === 'Gorilla') {
				initialHP = 4;
			}

			const player: Player = {
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
					sleepTurnsRemaining: 0,
					snapBackActive: false,
				},
				oneTimeActions: {
					hasHealed: false,
					hasShielded: false,
					hasUsedAbility: false,
				},
				abilityCooldown: 0,
				abilityDisabled: false,
			};

			if (teamId !== undefined) {
				player.teamId = teamId;
			}

			return player;
		},
		[],
	);

	const updateState = useCallback((updater: (state: GameState) => void) => {
		setStateWithHistory((prev) => {
			const clonedState = JSON.parse(JSON.stringify(prev.current)) as GameState;
			updater(clonedState);
			return {
				...prev,
				current: clonedState,
			};
		});
	}, []);

	return {
		state: stateWithHistory.current,
		stateHistory: stateWithHistory.history,
		unlockedAnimals,
		setUnlockedAnimals,
		initializeState,
		saveStateToHistory,
		restorePreviousState,
		logMessage,
		unlockAnimal,
		getNextLockedAnimal,
		createPlayer,
		updateState,
	};
}
