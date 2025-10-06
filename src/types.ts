export interface Player {
	id: number;
	name: string;
	animal: AnimalType;
	hp: number;
	maxHp: number;
	isAlive: boolean;
	isComputer: boolean;
	status: {
		isShielded: boolean;
		isSleeping: boolean;
	};
	oneTimeActions: {
		hasHealed: boolean;
		hasShielded: boolean;
		hasUsedAbility: boolean;
	};
	abilityCooldown: number;
	abilityDisabled: boolean;
}

export interface GameState {
	players: Player[];
	currentPlayerIndex: number;
	gameState: 'playing' | 'gameEnding' | 'gameOver';
	turn: number;
	actionInProgress: ActionInProgress | null;
	turnSkipped: boolean;
	log: LogEntry[];
}

export interface ActionInProgress {
	type: ActionType;
	sourceId: number;
	requiredTargets: number;
	targets: number[];
	prompt: string;
}

export interface LogEntry {
	message: string;
	indent: number;
}

export interface AnimalRoster {
	name: string;
	abilityDesc: string;
}

export type AnimalType = 'Coyote' | 'Llama' | 'Tiger' | 'Gorilla' | 'Monkey';

export type ActionType = 'attack' | 'spitball' | 'strike' | 'rampage' | 'mischief';

export type SoundType =
	| 'attack'
	| 'damage'
	| 'heal'
	| 'shield'
	| 'howl'
	| 'spitball'
	| 'strike'
	| 'rampage'
	| 'mischief'
	| 'defeat'
	| 'victory'
	| 'nothing'
	| 'sleep';

export type GameMode = 'standard' | 'challenger';
