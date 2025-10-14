import type {Meta, StoryObj} from '@storybook/react';
import {expect, fn} from '@storybook/test';
import {initializeState, createPlayer, state, setUnlockedAnimals} from '../game-state';
import {startTurn, endTurn, initiateTargetSelection} from '../game-flow';
import * as sound from '../sound';

const meta = {
	title: 'Logic/GameFlow',
	render: () => <div>Game flow logic tests</div>,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	beforeEach: () => {
		sound.setMuted(true);
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function setupGameDOM() {
	document.body.innerHTML = `
		<div id="game-screen">
			<div id="players-container"></div>
			<div id="turn-indicator"></div>
			<div class="action-buttons">
				<button data-action="attack">Attack</button>
				<button data-action="ability">Ability</button>
				<button data-action="heal">Heal</button>
				<button data-action="shield">Shield</button>
				<button data-action="nothing">Nothing</button>
			</div>
			<button id="undo-btn">Undo</button>
			<div id="game-log"></div>
		</div>
		<div id="game-over-screen" style="display: none;">
			<h2 id="winner-announcement"></h2>
		</div>
	`;

	(globalThis as any).lucide = {
		createIcons: fn(),
	};
}

export const InitializeGameStateWithTwoPlayers: Story = {
	play: async () => {
		const players = [createPlayer(0, 'Player 1', 'Coyote', false), createPlayer(1, 'Player 2', 'Coyote', false)];

		initializeState(players);

		await expect(state.players).toHaveLength(2);
		await expect(state.gameState).toBe('playing');
		await expect(state.players[0]!.name).toBe('Player 1');
		await expect(state.players[1]!.name).toBe('Player 2');
	},
};

export const StartTurnForFirstPlayer: Story = {
	play: async () => {
		setupGameDOM();

		const players = [createPlayer(0, 'Player 1', 'Coyote', false), createPlayer(1, 'Player 2', 'Coyote', false)];

		initializeState(players);
		startTurn();

		await expect(state.gameState).toBe('playing');
		await expect(state.log.length).toBeGreaterThan(0);
	},
};

export const EndTurnAndMoveToNextPlayer: Story = {
	play: async () => {
		setupGameDOM();

		const players = [createPlayer(0, 'Player 1', 'Coyote', false), createPlayer(1, 'Player 2', 'Coyote', false)];

		initializeState(players);
		const initialPlayerIndex = state.currentPlayerIndex;

		endTurn();

		await expect(state.currentPlayerIndex).not.toBe(initialPlayerIndex);
	},
};

export const TrackAlivePlayersCorrectly: Story = {
	play: async () => {
		const players = [createPlayer(0, 'Player 1', 'Coyote', false), createPlayer(1, 'Player 2', 'Coyote', false)];

		initializeState(players);

		const alivePlayers = state.players.filter((p) => p.isAlive);
		await expect(alivePlayers).toHaveLength(2);
	},
};

export const EndsGameInStandardMode: Story = {
	play: async () => {
		setupGameDOM();

		const players = [createPlayer(0, 'Player 1', 'Coyote', false), createPlayer(1, 'Player 2', 'Coyote', false)];

		initializeState(players, 'standard');
		state.players[1]!.isAlive = false;

		endTurn();

		await new Promise((resolve) => setTimeout(resolve, 100));
		await expect(state.gameState).toBe('gameEnding');
	},
};

export const EndsGameInChallengerModeWhenHumanPlayerWins: Story = {
	play: async () => {
		setupGameDOM();

		const humanPlayer = createPlayer(0, 'Human', 'Coyote', false);
		const computerPlayer = createPlayer(1, 'Computer', 'Tiger', true);

		initializeState([humanPlayer, computerPlayer], 'challenger');
		state.players[1]!.isAlive = false;

		endTurn();

		await new Promise((resolve) => setTimeout(resolve, 100));
		await expect(state.gameState).toBe('gameEnding');
	},
};

export const EndsGameInChallengerModeWhenComputerWins: Story = {
	play: async () => {
		setupGameDOM();

		const humanPlayer = createPlayer(0, 'Human', 'Coyote', false);
		const computerPlayer = createPlayer(1, 'Computer', 'Tiger', true);

		initializeState([humanPlayer, computerPlayer], 'challenger');
		state.players[0]!.isAlive = false;

		endTurn();

		await new Promise((resolve) => setTimeout(resolve, 100));
		await expect(state.gameState).toBe('gameEnding');
	},
};

export const AutomaticallyTargetOpponentWhenAttackingInChallengerMode: Story = {
	play: async () => {
		setupGameDOM();
		setUnlockedAnimals(new Set());

		const humanPlayer = createPlayer(0, 'Human', 'Coyote', false);
		const computerPlayer = createPlayer(1, 'Computer', 'Tiger', true);

		initializeState([humanPlayer, computerPlayer], 'challenger');
		state.currentPlayerIndex = 0;

		initiateTargetSelection('attack', humanPlayer.id, 1, 'Select a target to attack.');

		await expect(computerPlayer.hp).toBeLessThan(computerPlayer.maxHp);
		await expect(state.actionInProgress).toBe(null);
	},
};

export const AutomaticallyTargetOpponentForLlamaSpitballInChallengerMode: Story = {
	play: async () => {
		setupGameDOM();
		setUnlockedAnimals(new Set());

		const humanPlayer = createPlayer(0, 'Human', 'Llama', false);
		const computerPlayer = createPlayer(1, 'Computer', 'Coyote', true);

		initializeState([humanPlayer, computerPlayer], 'challenger');
		state.currentPlayerIndex = 0;

		initiateTargetSelection('spitball', humanPlayer.id, 1, 'Select a target for Spitball.');

		await expect(state.actionInProgress).toBe(null);
	},
};

export const AutomaticallyTargetOpponentForGorillaRampageInChallengerMode: Story = {
	play: async () => {
		setupGameDOM();
		setUnlockedAnimals(new Set());

		const humanPlayer = createPlayer(0, 'Human', 'Gorilla', false);
		const computerPlayer = createPlayer(1, 'Computer', 'Coyote', true);

		initializeState([humanPlayer, computerPlayer], 'challenger');
		state.currentPlayerIndex = 0;

		initiateTargetSelection('rampage', humanPlayer.id, 1, 'Select a target for Rampage.');

		await expect(computerPlayer.hp).toBeLessThan(computerPlayer.maxHp);
		await expect(state.actionInProgress).toBe(null);
	},
};

export const AutomaticallyTargetOpponentForMonkeyMischiefInChallengerMode: Story = {
	play: async () => {
		setupGameDOM();
		setUnlockedAnimals(new Set());

		const humanPlayer = createPlayer(0, 'Human', 'Monkey', false);
		const computerPlayer = createPlayer(1, 'Computer', 'Coyote', true);

		initializeState([humanPlayer, computerPlayer], 'challenger');
		state.currentPlayerIndex = 0;

		initiateTargetSelection('mischief', humanPlayer.id, 1, 'Select a target for Mischief.');

		await expect(computerPlayer.abilityDisabled).toBe(true);
		await expect(state.actionInProgress).toBe(null);
	},
};

export const RequireManualTargetSelectionInStandardMode: Story = {
	play: async () => {
		setupGameDOM();

		const player1 = createPlayer(0, 'Player 1', 'Coyote', false);
		const player2 = createPlayer(1, 'Player 2', 'Tiger', false);
		const player3 = createPlayer(2, 'Player 3', 'Llama', false);

		initializeState([player1, player2, player3], 'standard');
		state.currentPlayerIndex = 0;

		initiateTargetSelection('attack', player1.id, 1, 'Select a target to attack.');

		await expect(state.actionInProgress).not.toBe(null);
		await expect(state.actionInProgress?.type).toBe('attack');
	},
};
