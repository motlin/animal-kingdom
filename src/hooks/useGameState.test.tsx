import {describe, it, expect} from 'vitest';
import {renderHook, act} from '@testing-library/react';
import {useGameState} from './useGameState.ts';
import type {Player} from '../types.ts';

describe('useGameState', () => {
	it('initializes with default state', () => {
		const {result} = renderHook(() => useGameState());

		expect(result.current.state.players).toEqual([]);
		expect(result.current.state.currentPlayerIndex).toBe(0);
		expect(result.current.state.gameState).toBe('playing');
		expect(result.current.state.gameMode).toBe('standard');
		expect(result.current.state.turn).toBe(1);
		expect(result.current.state.actionInProgress).toBe(null);
		expect(result.current.state.turnSkipped).toBe(false);
		expect(result.current.state.log).toEqual([]);
		expect(result.current.stateHistory).toEqual([]);
		expect(result.current.unlockedAnimals.size).toBe(0);
	});

	it('creates a player with correct initial values', () => {
		const {result} = renderHook(() => useGameState());

		const player = result.current.createPlayer(1, 'Test Player', 'Coyote', false);

		expect(player.id).toBe(1);
		expect(player.name).toBe('Test Player');
		expect(player.animal).toBe('Coyote');
		expect(player.hp).toBe(3);
		expect(player.maxHp).toBe(3);
		expect(player.isAlive).toBe(true);
		expect(player.isComputer).toBe(false);
		expect(player.status.isShielded).toBe(false);
		expect(player.status.isSleeping).toBe(false);
		expect(player.oneTimeActions.hasHealed).toBe(false);
		expect(player.oneTimeActions.hasShielded).toBe(false);
		expect(player.oneTimeActions.hasUsedAbility).toBe(false);
		expect(player.abilityCooldown).toBe(0);
		expect(player.abilityDisabled).toBe(false);
	});

	it('creates a Gorilla player with 4 HP', () => {
		const {result} = renderHook(() => useGameState());

		const player = result.current.createPlayer(1, 'Gorilla Player', 'Gorilla', false);

		expect(player.hp).toBe(4);
		expect(player.maxHp).toBe(4);
	});

	it('initializes state with players', () => {
		const {result} = renderHook(() => useGameState());

		const players: Player[] = [
			result.current.createPlayer(1, 'Player 1', 'Coyote', false),
			result.current.createPlayer(2, 'Player 2', 'Llama', true),
		];

		act(() => {
			result.current.initializeState(players, 'standard');
		});

		expect(result.current.state.players).toEqual(players);
		expect(result.current.state.gameMode).toBe('standard');
		expect(result.current.state.turn).toBe(1);
		expect(result.current.state.currentPlayerIndex).toBeGreaterThanOrEqual(0);
		expect(result.current.state.currentPlayerIndex).toBeLessThan(players.length);
		expect(result.current.stateHistory).toEqual([]);
	});

	it('logs messages to the state', () => {
		const {result} = renderHook(() => useGameState());

		act(() => {
			result.current.logMessage('First message');
			result.current.logMessage('Second message', 1);
		});

		expect(result.current.state.log).toEqual([
			{message: 'First message', indent: 0},
			{message: 'Second message', indent: 1},
		]);
	});

	it('saves state to history', () => {
		const {result} = renderHook(() => useGameState());

		const players: Player[] = [result.current.createPlayer(1, 'Player 1', 'Coyote', false)];

		act(() => {
			result.current.initializeState(players);
			result.current.saveStateToHistory();
			result.current.logMessage('After save');
		});

		expect(result.current.stateHistory.length).toBe(1);
		expect(result.current.stateHistory[0]?.log).toEqual([]);
		expect(result.current.state.log).toEqual([{message: 'After save', indent: 0}]);
	});

	it('restores previous state', () => {
		const {result} = renderHook(() => useGameState());

		const players: Player[] = [result.current.createPlayer(1, 'Player 1', 'Coyote', false)];

		act(() => {
			result.current.initializeState(players);
			result.current.logMessage('First message');
			result.current.saveStateToHistory();
			result.current.logMessage('Second message');
			result.current.restorePreviousState();
		});

		expect(result.current.state.log).toEqual([{message: 'First message', indent: 0}]);
		expect(result.current.stateHistory).toEqual([]);
	});

	it('unlocks animals', () => {
		const {result} = renderHook(() => useGameState());

		act(() => {
			result.current.unlockAnimal('Coyote');
			result.current.unlockAnimal('Llama');
		});

		expect(result.current.unlockedAnimals.has('Coyote')).toBe(true);
		expect(result.current.unlockedAnimals.has('Llama')).toBe(true);
		expect(result.current.unlockedAnimals.has('Tiger')).toBe(false);
	});

	it('does not unlock the same animal twice', () => {
		const {result} = renderHook(() => useGameState());

		act(() => {
			result.current.unlockAnimal('Coyote');
			result.current.unlockAnimal('Coyote');
		});

		expect(result.current.unlockedAnimals.size).toBe(1);
	});

	it('gets next locked animal in order', () => {
		const {result} = renderHook(() => useGameState());

		expect(result.current.getNextLockedAnimal()).toBe('Coyote');

		act(() => {
			result.current.unlockAnimal('Coyote');
		});

		expect(result.current.getNextLockedAnimal()).toBe('Llama');

		act(() => {
			result.current.unlockAnimal('Llama');
			result.current.unlockAnimal('Tiger');
		});

		expect(result.current.getNextLockedAnimal()).toBe('Gorilla');
	});

	it('returns null when all animals are unlocked', () => {
		const {result} = renderHook(() => useGameState());

		act(() => {
			result.current.unlockAnimal('Coyote');
			result.current.unlockAnimal('Llama');
			result.current.unlockAnimal('Tiger');
			result.current.unlockAnimal('Gorilla');
			result.current.unlockAnimal('Monkey');
		});

		expect(result.current.getNextLockedAnimal()).toBe(null);
	});

	it('sets unlocked animals', () => {
		const {result} = renderHook(() => useGameState());

		const animals = new Set(['Coyote', 'Tiger', 'Monkey']);

		act(() => {
			result.current.setUnlockedAnimals(animals);
		});

		expect(result.current.unlockedAnimals.has('Coyote')).toBe(true);
		expect(result.current.unlockedAnimals.has('Llama')).toBe(false);
		expect(result.current.unlockedAnimals.has('Tiger')).toBe(true);
		expect(result.current.unlockedAnimals.has('Gorilla')).toBe(false);
		expect(result.current.unlockedAnimals.has('Monkey')).toBe(true);
	});
});
