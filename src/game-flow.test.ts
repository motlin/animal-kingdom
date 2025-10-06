import {describe, it, expect, beforeEach, vi} from 'vitest';
import {initializeState, createPlayer, state} from './game-state.ts';
import {startTurn, endTurn} from './game-flow.ts';

describe('Game flow', () => {
	beforeEach(() => {
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

		(global as any).lucide = {
			createIcons: vi.fn(),
		};

		vi.mock('./sound.ts', () => ({
			playSound: vi.fn(),
			initializeAudioContext: vi.fn(),
			setMuted: vi.fn(),
			isSoundMuted: vi.fn(() => false),
		}));
	});

	it('initializes game state with two players', () => {
		const players = [createPlayer(0, 'Player 1', 'Coyote', false), createPlayer(1, 'Player 2', 'Coyote', false)];

		initializeState(players);

		expect(state.players).toHaveLength(2);
		expect(state.gameState).toBe('playing');
		expect(state.players[0]!.name).toBe('Player 1');
		expect(state.players[1]!.name).toBe('Player 2');
	});

	it('starts turn for first player', () => {
		const players = [createPlayer(0, 'Player 1', 'Coyote', false), createPlayer(1, 'Player 2', 'Coyote', false)];

		initializeState(players);
		startTurn();

		expect(state.gameState).toBe('playing');
		expect(state.log.length).toBeGreaterThan(0);
	});

	it('ends turn and moves to next player', () => {
		const players = [createPlayer(0, 'Player 1', 'Coyote', false), createPlayer(1, 'Player 2', 'Coyote', false)];

		initializeState(players);
		const initialPlayerIndex = state.currentPlayerIndex;

		endTurn();

		expect(state.currentPlayerIndex).not.toBe(initialPlayerIndex);
	});

	it('tracks alive players correctly', () => {
		const players = [createPlayer(0, 'Player 1', 'Coyote', false), createPlayer(1, 'Player 2', 'Coyote', false)];

		initializeState(players);

		const alivePlayers = state.players.filter((p) => p.isAlive);
		expect(alivePlayers).toHaveLength(2);
	});
});
