import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {renderHook, act} from '@testing-library/react';
import {useGameFlow, type UseGameFlowCallbacks} from './useGameFlow.ts';
import {useGameState, type UseGameStateReturn} from './useGameState.ts';
import {useGameActions, type UseGameActionsReturn} from './useGameActions.ts';
import * as sound from '../sound.ts';

vi.mock('../sound.ts', () => ({
	playSound: vi.fn(),
}));

interface TestHookResult {
	gameState: UseGameStateReturn;
	gameActions: UseGameActionsReturn;
	gameFlow: ReturnType<typeof useGameFlow>;
}

function useTestHooks(callbacks: UseGameFlowCallbacks = {}): TestHookResult {
	const gameState = useGameState();
	const gameActions = useGameActions();
	const gameFlow = useGameFlow(gameState, gameActions, callbacks);
	return {gameState, gameActions, gameFlow};
}

describe('useGameFlow', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	describe('startTurn', () => {
		it('saves state history and logs turn start', () => {
			const {result} = renderHook(() => useTestHooks());

			act(() => {
				const player1 = result.current.gameState.createPlayer(0, 'Player 1', 'Coyote', false);
				const player2 = result.current.gameState.createPlayer(1, 'Player 2', 'Llama', false);
				result.current.gameState.initializeState([player1, player2], 'standard');
			});

			act(() => {
				result.current.gameFlow.startTurn();
			});

			expect(result.current.gameState.stateHistory.length).toBe(1);
			expect(result.current.gameState.state.log.some((entry) => entry.message.includes("It's"))).toBe(true);
		});

		it('removes shield at start of turn', () => {
			const {result} = renderHook(() => useTestHooks());

			act(() => {
				const player1 = result.current.gameState.createPlayer(0, 'Player 1', 'Coyote', false);
				player1.status.isShielded = true;
				const player2 = result.current.gameState.createPlayer(1, 'Player 2', 'Llama', false);
				result.current.gameState.initializeState([player1, player2], 'standard');
			});

			act(() => {
				result.current.gameState.updateState((s) => {
					s.currentPlayerIndex = 0;
				});
			});

			act(() => {
				result.current.gameFlow.startTurn();
			});

			expect(result.current.gameState.state.players.some((p) => p.status.isShielded)).toBe(false);
			expect(
				result.current.gameState.state.log.some((entry) => entry.message.includes('shield has worn off')),
			).toBe(true);
		});

		it('skips turn if player is sleeping', () => {
			const {result} = renderHook(() => useTestHooks());

			act(() => {
				const player1 = result.current.gameState.createPlayer(0, 'Player 1', 'Coyote', false);
				player1.status.isSleeping = true;
				const player2 = result.current.gameState.createPlayer(1, 'Player 2', 'Llama', false);
				result.current.gameState.initializeState([player1, player2], 'standard');
			});

			act(() => {
				result.current.gameState.updateState((s) => {
					s.currentPlayerIndex = 0;
				});
			});

			act(() => {
				result.current.gameFlow.startTurn();
				vi.advanceTimersByTime(1500);
			});

			expect(result.current.gameState.state.players.every((p) => !p.status.isSleeping)).toBe(true);
			expect(result.current.gameState.state.turnSkipped).toBe(true);
			expect(
				result.current.gameState.state.log.some((entry) =>
					entry.message.includes('is asleep and skips their turn'),
				),
			).toBe(true);
		});
	});

	describe('endTurn', () => {
		it('decrements ability cooldown at end of turn', () => {
			const {result} = renderHook(() => useTestHooks());

			act(() => {
				const player1 = result.current.gameState.createPlayer(0, 'Player 1', 'Coyote', false);
				player1.abilityCooldown = 2;
				const player2 = result.current.gameState.createPlayer(1, 'Player 2', 'Llama', false);
				result.current.gameState.initializeState([player1, player2], 'standard');
			});

			act(() => {
				result.current.gameState.updateState((s) => {
					s.currentPlayerIndex = 0;
				});
			});

			act(() => {
				result.current.gameFlow.endTurn();
			});

			const previousPlayer = result.current.gameState.state.players.find((p) => p.name === 'Player 1');
			expect(previousPlayer?.abilityCooldown).toBe(1);
		});

		it('advances to next alive player', () => {
			const {result} = renderHook(() => useTestHooks());

			act(() => {
				const player1 = result.current.gameState.createPlayer(0, 'Player 1', 'Coyote', false);
				const player2 = result.current.gameState.createPlayer(1, 'Player 2', 'Llama', false);
				player2.isAlive = false;
				const player3 = result.current.gameState.createPlayer(2, 'Player 3', 'Tiger', false);
				result.current.gameState.initializeState([player1, player2, player3], 'standard');
			});

			act(() => {
				result.current.gameState.updateState((s) => {
					s.currentPlayerIndex = 0;
				});
			});

			act(() => {
				result.current.gameFlow.endTurn();
			});

			expect(result.current.gameState.state.currentPlayerIndex).toBe(2);
		});

		it('ends game when one player remains in standard mode', () => {
			const onEndGame = vi.fn();
			const onShowConfetti = vi.fn();
			const {result} = renderHook(() => useTestHooks({onEndGame, onShowConfetti}));

			act(() => {
				const player1 = result.current.gameState.createPlayer(0, 'Player 1', 'Coyote', false);
				const player2 = result.current.gameState.createPlayer(1, 'Player 2', 'Llama', false);
				player2.hp = 0;
				player2.isAlive = false;
				result.current.gameState.initializeState([player1, player2], 'standard');
				result.current.gameState.state.currentPlayerIndex = 0;
			});

			act(() => {
				result.current.gameFlow.endTurn();
			});

			expect(result.current.gameState.state.gameState).toBe('gameEnding');
			expect(onShowConfetti).toHaveBeenCalled();

			act(() => {
				vi.advanceTimersByTime(2000);
			});

			expect(result.current.gameState.state.gameState).toBe('gameOver');
			expect(sound.playSound).toHaveBeenCalledWith('victory');
		});

		it('does not show confetti when computer wins in challenger mode', () => {
			const onShowConfetti = vi.fn();
			const {result} = renderHook(() => useTestHooks({onShowConfetti}));

			act(() => {
				const player1 = result.current.gameState.createPlayer(0, 'Player 1', 'Coyote', false);
				player1.hp = 0;
				player1.isAlive = false;
				const player2 = result.current.gameState.createPlayer(1, 'Computer', 'Llama', true);
				result.current.gameState.initializeState([player1, player2], 'challenger');
				result.current.gameState.state.currentPlayerIndex = 0;
			});

			act(() => {
				result.current.gameFlow.endTurn();
			});

			expect(onShowConfetti).not.toHaveBeenCalled();
		});

		it('unlocks animal when player wins in challenger mode', () => {
			const {result} = renderHook(() => useTestHooks());

			act(() => {
				const player1 = result.current.gameState.createPlayer(0, 'Player 1', 'Coyote', false);
				const player2 = result.current.gameState.createPlayer(1, 'Computer', 'Tiger', true);
				player2.hp = 0;
				player2.isAlive = false;
				result.current.gameState.initializeState([player1, player2], 'challenger');
				result.current.gameState.state.currentPlayerIndex = 0;
			});

			act(() => {
				result.current.gameFlow.endTurn();
				vi.advanceTimersByTime(2000);
			});

			expect(result.current.gameState.unlockedAnimals.has('Tiger')).toBe(true);
			expect(
				result.current.gameState.state.log.some((entry) => entry.message.includes('You unlocked the Tiger!')),
			).toBe(true);
		});
	});

	describe('playComputerTurn', () => {
		it('attacks random opponent', () => {
			const {result} = renderHook(() => useTestHooks());

			act(() => {
				const player1 = result.current.gameState.createPlayer(0, 'Computer', 'Coyote', true);
				const player2 = result.current.gameState.createPlayer(1, 'Player 2', 'Llama', false);
				result.current.gameState.initializeState([player1, player2], 'standard');
			});

			act(() => {
				result.current.gameFlow.playComputerTurn(result.current.gameState.state.players[0]!);
			});

			expect(result.current.gameState.state.players[1]?.hp).toBe(2);
			expect(sound.playSound).toHaveBeenCalledWith('attack');
		});

		it('ends turn immediately if no opponents remain', () => {
			const onShowConfetti = vi.fn();
			const {result} = renderHook(() => useTestHooks({onShowConfetti}));

			act(() => {
				const player1 = result.current.gameState.createPlayer(0, 'Computer', 'Coyote', true);
				result.current.gameState.initializeState([player1], 'standard');
			});

			act(() => {
				result.current.gameFlow.playComputerTurn(result.current.gameState.state.players[0]!);
			});

			expect(result.current.gameState.state.gameState).toBe('gameEnding');
		});
	});

	describe('handleUndo', () => {
		it('restores previous state', () => {
			const {result} = renderHook(() => useTestHooks());

			act(() => {
				const player1 = result.current.gameState.createPlayer(0, 'Player 1', 'Coyote', false);
				const player2 = result.current.gameState.createPlayer(1, 'Player 2', 'Llama', false);
				result.current.gameState.initializeState([player1, player2], 'standard');
				result.current.gameState.saveStateToHistory();
				result.current.gameState.logMessage('New message');
			});

			act(() => {
				result.current.gameFlow.handleUndo();
			});

			expect(result.current.gameState.state.log.some((entry) => entry.message.includes('Turn undone'))).toBe(
				true,
			);
		});
	});

	describe('initiateTargetSelection', () => {
		it('sets action in progress', () => {
			const onRender = vi.fn();
			const {result} = renderHook(() => useTestHooks({onRender}));

			act(() => {
				const player1 = result.current.gameState.createPlayer(0, 'Player 1', 'Coyote', false);
				const player2 = result.current.gameState.createPlayer(1, 'Player 2', 'Llama', false);
				result.current.gameState.initializeState([player1, player2], 'standard');
			});

			act(() => {
				result.current.gameFlow.initiateTargetSelection('attack', 0, 1, 'Select a target');
			});

			expect(result.current.gameState.state.actionInProgress).toEqual({
				type: 'attack',
				sourceId: 0,
				requiredTargets: 1,
				targets: [],
				prompt: 'Select a target',
			});
		});

		it('auto-selects single opponent in challenger mode', () => {
			const {result} = renderHook(() => useTestHooks());

			act(() => {
				const player1 = result.current.gameState.createPlayer(0, 'Player 1', 'Coyote', false);
				const player2 = result.current.gameState.createPlayer(1, 'Computer', 'Llama', true);
				result.current.gameState.initializeState([player1, player2], 'challenger');
				result.current.gameState.state.currentPlayerIndex = 0;
			});

			act(() => {
				result.current.gameFlow.initiateTargetSelection('attack', 0, 1, 'Select a target');
			});

			expect(result.current.gameState.state.players[1]?.hp).toBe(2);
			expect(result.current.gameState.state.actionInProgress).toBe(null);
		});
	});

	describe('executeTargetedAction', () => {
		it('executes attack action', () => {
			const {result} = renderHook(() => useTestHooks());

			act(() => {
				const player1 = result.current.gameState.createPlayer(0, 'Player 1', 'Coyote', false);
				const player2 = result.current.gameState.createPlayer(1, 'Player 2', 'Llama', false);
				result.current.gameState.initializeState([player1, player2], 'standard');
			});

			act(() => {
				result.current.gameState.updateState((s) => {
					s.currentPlayerIndex = 0;
					s.actionInProgress = {
						type: 'attack',
						sourceId: 0,
						requiredTargets: 1,
						targets: [],
						prompt: 'Select a target',
					};
				});
			});

			act(() => {
				result.current.gameFlow.executeTargetedAction(1);
			});

			expect(result.current.gameState.state.players[1]!.hp).toBe(2);
		});

		it('waits for second target in strike', () => {
			const {result} = renderHook(() => useTestHooks());

			act(() => {
				const player1 = result.current.gameState.createPlayer(0, 'Player 1', 'Tiger', false);
				const player2 = result.current.gameState.createPlayer(1, 'Player 2', 'Llama', false);
				const player3 = result.current.gameState.createPlayer(2, 'Player 3', 'Coyote', false);
				result.current.gameState.initializeState([player1, player2, player3], 'standard');
			});

			act(() => {
				result.current.gameState.updateState((s) => {
					s.actionInProgress = {
						type: 'strike',
						sourceId: 0,
						requiredTargets: 2,
						targets: [],
						prompt: 'Select target 1 of 2',
					};
				});
			});

			act(() => {
				result.current.gameFlow.executeTargetedAction(1);
			});

			expect(result.current.gameState.state.actionInProgress).toBeTruthy();
			expect(result.current.gameState.state.actionInProgress!.targets).toEqual([1]);
			expect(result.current.gameState.state.actionInProgress!.prompt).toBe('Select target 2 of 2.');
			expect(result.current.gameState.state.players[1]?.hp).toBe(3);
		});

		it('executes strike with two targets', () => {
			const {result} = renderHook(() => useTestHooks());

			act(() => {
				const player1 = result.current.gameState.createPlayer(0, 'Player 1', 'Tiger', false);
				const player2 = result.current.gameState.createPlayer(1, 'Player 2', 'Llama', false);
				const player3 = result.current.gameState.createPlayer(2, 'Player 3', 'Coyote', false);
				result.current.gameState.initializeState([player1, player2, player3], 'standard');
			});

			act(() => {
				result.current.gameState.updateState((s) => {
					s.currentPlayerIndex = 0;
					s.actionInProgress = {
						type: 'strike',
						sourceId: 0,
						requiredTargets: 2,
						targets: [1],
						prompt: 'Select target 2 of 2',
					};
				});
			});

			act(() => {
				result.current.gameFlow.executeTargetedAction(2);
			});

			expect(result.current.gameState.state.players[1]!.hp).toBe(2);
			expect(result.current.gameState.state.players[2]!.hp).toBe(2);
		});
	});

	describe('handleAbility', () => {
		it('executes Coyote Howl immediately', () => {
			const onRender = vi.fn();
			const {result} = renderHook(() => useTestHooks({onRender}));

			act(() => {
				const player1 = result.current.gameState.createPlayer(0, 'Player 1', 'Coyote', false);
				const player2 = result.current.gameState.createPlayer(1, 'Player 2', 'Llama', false);
				result.current.gameState.initializeState([player1, player2], 'standard');
			});

			act(() => {
				result.current.gameFlow.handleAbility(result.current.gameState.state.players[0]!);
			});

			expect(result.current.gameState.state.players[0]?.abilityCooldown).toBe(2);
			expect(result.current.gameState.state.players[1]?.status.isSleeping).toBe(true);
		});

		it('initiates target selection for Llama Spitball', () => {
			const onRender = vi.fn();
			const {result} = renderHook(() => useTestHooks({onRender}));

			act(() => {
				const player1 = result.current.gameState.createPlayer(0, 'Player 1', 'Llama', false);
				const player2 = result.current.gameState.createPlayer(1, 'Player 2', 'Coyote', false);
				result.current.gameState.initializeState([player1, player2], 'standard');
			});

			act(() => {
				result.current.gameFlow.handleAbility(result.current.gameState.state.players[0]!);
			});

			expect(result.current.gameState.state.actionInProgress?.type).toBe('spitball');
			expect(result.current.gameState.state.actionInProgress?.requiredTargets).toBe(1);
		});

		it('initiates target selection for Tiger Strike', () => {
			const onRender = vi.fn();
			const {result} = renderHook(() => useTestHooks({onRender}));

			act(() => {
				const player1 = result.current.gameState.createPlayer(0, 'Player 1', 'Tiger', false);
				const player2 = result.current.gameState.createPlayer(1, 'Player 2', 'Coyote', false);
				result.current.gameState.initializeState([player1, player2], 'standard');
			});

			act(() => {
				result.current.gameFlow.handleAbility(result.current.gameState.state.players[0]!);
			});

			expect(result.current.gameState.state.actionInProgress?.type).toBe('strike');
			expect(result.current.gameState.state.actionInProgress?.requiredTargets).toBe(2);
		});

		it('initiates target selection for Gorilla Rampage', () => {
			const onRender = vi.fn();
			const {result} = renderHook(() => useTestHooks({onRender}));

			act(() => {
				const player1 = result.current.gameState.createPlayer(0, 'Player 1', 'Gorilla', false);
				const player2 = result.current.gameState.createPlayer(1, 'Player 2', 'Coyote', false);
				result.current.gameState.initializeState([player1, player2], 'standard');
			});

			act(() => {
				result.current.gameFlow.handleAbility(result.current.gameState.state.players[0]!);
			});

			expect(result.current.gameState.state.actionInProgress?.type).toBe('rampage');
			expect(result.current.gameState.state.actionInProgress?.requiredTargets).toBe(1);
		});

		it('initiates target selection for Monkey Mischief', () => {
			const onRender = vi.fn();
			const {result} = renderHook(() => useTestHooks({onRender}));

			act(() => {
				const player1 = result.current.gameState.createPlayer(0, 'Player 1', 'Monkey', false);
				const player2 = result.current.gameState.createPlayer(1, 'Player 2', 'Coyote', false);
				result.current.gameState.initializeState([player1, player2], 'standard');
			});

			act(() => {
				result.current.gameFlow.handleAbility(result.current.gameState.state.players[0]!);
			});

			expect(result.current.gameState.state.actionInProgress?.type).toBe('mischief');
			expect(result.current.gameState.state.actionInProgress?.requiredTargets).toBe(1);
		});
	});
});
