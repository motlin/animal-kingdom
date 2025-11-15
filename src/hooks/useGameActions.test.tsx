import {describe, it, expect, vi, beforeEach} from 'vitest';
import {renderHook} from '@testing-library/react';
import {useGameActions} from './useGameActions.ts';
import type {Player, GameState} from '../lib/types.ts';
import * as sound from '../sound.ts';

vi.mock('../sound.ts', () => ({
	playSound: vi.fn(),
}));

function createTestPlayer(
	id: number,
	name: string,
	animal: 'Coyote' | 'Llama' | 'Tiger' | 'Gorilla' | 'Monkey',
	hp: number = 3,
): Player {
	return {
		id,
		name,
		animal,
		hp,
		maxHp: animal === 'Gorilla' ? 4 : 3,
		isAlive: true,
		isComputer: false,
		status: {
			isShielded: false,
			isSleeping: false,
			sleepTurnsRemaining: 0,
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

describe('useGameActions', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('applyDamage', () => {
		it('applies damage to a player without shield', () => {
			const {result} = renderHook(() => useGameActions());
			const target = createTestPlayer(1, 'Target', 'Coyote');
			const source = createTestPlayer(2, 'Source', 'Llama');
			const logMessage = vi.fn();
			const unlockAnimal = vi.fn();

			const actualDamage = result.current.applyDamage(target, 2, source, logMessage, unlockAnimal);

			expect(actualDamage).toBe(2);
			expect(target.hp).toBe(1);
			expect(target.isAlive).toBe(true);
			expect(sound.playSound).toHaveBeenCalledWith('damage');
			expect(logMessage).toHaveBeenCalledWith('Target (Coyote) now has 1/3 HP.', 2);
		});

		it('blocks damage with shield', () => {
			const {result} = renderHook(() => useGameActions());
			const target = createTestPlayer(1, 'Target', 'Coyote');
			target.status.isShielded = true;
			const source = createTestPlayer(2, 'Source', 'Llama');
			const logMessage = vi.fn();
			const unlockAnimal = vi.fn();

			const actualDamage = result.current.applyDamage(target, 2, source, logMessage, unlockAnimal);

			expect(actualDamage).toBe(0);
			expect(target.hp).toBe(3);
			expect(target.isAlive).toBe(true);
			expect(sound.playSound).toHaveBeenCalledWith('shield');
			expect(logMessage).toHaveBeenCalledWith("Target's (Coyote) shield blocked the attack from Source!", 2);
		});

		it('defeats player when hp reaches zero', () => {
			const {result} = renderHook(() => useGameActions());
			const target = createTestPlayer(1, 'Target', 'Tiger');
			target.hp = 1;
			const source = createTestPlayer(2, 'Source', 'Llama');
			const logMessage = vi.fn();
			const unlockAnimal = vi.fn();

			const actualDamage = result.current.applyDamage(target, 2, source, logMessage, unlockAnimal);

			expect(actualDamage).toBe(1);
			expect(target.hp).toBe(0);
			expect(target.isAlive).toBe(false);
			expect(sound.playSound).toHaveBeenCalledWith('damage');
			expect(sound.playSound).toHaveBeenCalledWith('defeat');
			expect(logMessage).toHaveBeenCalledWith('Target (Tiger) now has 0/3 HP.', 2);
			expect(logMessage).toHaveBeenCalledWith("Target's (Tiger) has been defeated!", 3);
			expect(unlockAnimal).toHaveBeenCalledWith('Tiger');
		});

		it('caps damage at remaining hp', () => {
			const {result} = renderHook(() => useGameActions());
			const target = createTestPlayer(1, 'Target', 'Coyote');
			target.hp = 1;
			const source = createTestPlayer(2, 'Source', 'Llama');
			const logMessage = vi.fn();
			const unlockAnimal = vi.fn();

			const actualDamage = result.current.applyDamage(target, 5, source, logMessage, unlockAnimal);

			expect(actualDamage).toBe(1);
			expect(target.hp).toBe(0);
		});
	});

	describe('handleAttack', () => {
		it('attacks target with 1 damage', () => {
			const {result} = renderHook(() => useGameActions());
			const source = createTestPlayer(1, 'Attacker', 'Coyote');
			const target = createTestPlayer(2, 'Target', 'Llama');
			const logMessage = vi.fn();
			const unlockAnimal = vi.fn();

			result.current.handleAttack(source, target, logMessage, unlockAnimal);

			expect(sound.playSound).toHaveBeenCalledWith('attack');
			expect(logMessage).toHaveBeenCalledWith('Attacker (Coyote) attacks Target (Llama).', 1);
			expect(target.hp).toBe(2);
		});
	});

	describe('handleHeal', () => {
		it('heals player below max hp', () => {
			const {result} = renderHook(() => useGameActions());
			const source = createTestPlayer(1, 'Healer', 'Coyote');
			source.hp = 1;
			const logMessage = vi.fn();

			result.current.handleHeal(source, logMessage);

			expect(source.hp).toBe(2);
			expect(source.oneTimeActions.hasHealed).toBe(true);
			expect(sound.playSound).toHaveBeenCalledWith('heal');
			expect(logMessage).toHaveBeenCalledWith('Healer (Coyote) healed for 1 HP.', 1);
		});

		it('overheals player at max hp', () => {
			const {result} = renderHook(() => useGameActions());
			const source = createTestPlayer(1, 'Healer', 'Coyote');
			const logMessage = vi.fn();

			result.current.handleHeal(source, logMessage);

			expect(source.hp).toBe(4);
			expect(source.oneTimeActions.hasHealed).toBe(true);
			expect(sound.playSound).toHaveBeenCalledWith('heal');
			expect(logMessage).toHaveBeenCalledWith('Healer (Coyote) is overhealed for 1 HP! (4/3)', 1);
		});
	});

	describe('handleShield', () => {
		it('raises shield for player', () => {
			const {result} = renderHook(() => useGameActions());
			const source = createTestPlayer(1, 'Shielder', 'Coyote');
			const logMessage = vi.fn();

			result.current.handleShield(source, logMessage);

			expect(source.status.isShielded).toBe(true);
			expect(source.oneTimeActions.hasShielded).toBe(true);
			expect(sound.playSound).toHaveBeenCalledWith('shield');
			expect(logMessage).toHaveBeenCalledWith(
				'Shielder (Coyote) raised a shield! It will block the next incoming damage.',
				1,
			);
		});
	});

	describe('handleHowl', () => {
		it('puts all non-Coyote players to sleep', () => {
			const {result} = renderHook(() => useGameActions());
			const source = createTestPlayer(1, 'Howler', 'Coyote');
			const otherCoyote = createTestPlayer(2, 'Other Coyote', 'Coyote');
			const llama = createTestPlayer(3, 'Llama', 'Llama');
			const tiger = createTestPlayer(4, 'Tiger', 'Tiger');
			const state: GameState = {
				players: [source, otherCoyote, llama, tiger],
				currentPlayerIndex: 0,
				gameState: 'playing',
				gameMode: 'standard',
				turn: 1,
				actionInProgress: null,
				turnSkipped: false,
				log: [],
			};
			const logMessage = vi.fn();

			result.current.handleHowl(source, state, logMessage);

			expect(source.abilityCooldown).toBe(2);
			expect(source.status.isSleeping).toBe(false);
			expect(otherCoyote.status.isSleeping).toBe(false);
			expect(llama.status.isSleeping).toBe(true);
			expect(tiger.status.isSleeping).toBe(true);
			expect(sound.playSound).toHaveBeenCalledWith('howl');
			expect(sound.playSound).toHaveBeenCalledWith('sleep');
			expect(logMessage).toHaveBeenCalledWith('Howler the Coyote lets out a piercing Howl!', 1);
		});

		it('does not affect dead players', () => {
			const {result} = renderHook(() => useGameActions());
			const source = createTestPlayer(1, 'Howler', 'Coyote');
			const llama = createTestPlayer(2, 'Llama', 'Llama');
			llama.isAlive = false;
			const state: GameState = {
				players: [source, llama],
				currentPlayerIndex: 0,
				gameState: 'playing',
				gameMode: 'standard',
				turn: 1,
				actionInProgress: null,
				turnSkipped: false,
				log: [],
			};
			const logMessage = vi.fn();

			result.current.handleHowl(source, state, logMessage);

			expect(llama.status.isSleeping).toBe(false);
		});
	});

	describe('handleSpitball', () => {
		it('can deal 2 damage with 15% chance', () => {
			const {result} = renderHook(() => useGameActions());
			vi.spyOn(Math, 'random').mockReturnValue(0.1);
			const source = createTestPlayer(1, 'Spitter', 'Llama');
			const target = createTestPlayer(2, 'Target', 'Coyote');
			const logMessage = vi.fn();
			const unlockAnimal = vi.fn();

			result.current.handleSpitball(source, target, logMessage, unlockAnimal);

			expect(target.hp).toBe(1);
			expect(sound.playSound).toHaveBeenCalledWith('spitball');
			expect(logMessage).toHaveBeenCalledWith('Spitter the Llama uses Spitball on Target (Coyote)...', 1);
			expect(logMessage).toHaveBeenCalledWith("It's a direct hit for 2 damage!", 2);
		});

		it('can deal 1 damage with 40% chance', () => {
			const {result} = renderHook(() => useGameActions());
			vi.spyOn(Math, 'random').mockReturnValue(0.3);
			const source = createTestPlayer(1, 'Spitter', 'Llama');
			const target = createTestPlayer(2, 'Target', 'Coyote');
			const logMessage = vi.fn();
			const unlockAnimal = vi.fn();

			result.current.handleSpitball(source, target, logMessage, unlockAnimal);

			expect(target.hp).toBe(2);
			expect(logMessage).toHaveBeenCalledWith("It's a direct hit for 1 damage!", 2);
		});

		it('can miss with 45% chance', () => {
			const {result} = renderHook(() => useGameActions());
			vi.spyOn(Math, 'random').mockReturnValue(0.8);
			const source = createTestPlayer(1, 'Spitter', 'Llama');
			const target = createTestPlayer(2, 'Target', 'Coyote');
			const logMessage = vi.fn();
			const unlockAnimal = vi.fn();

			result.current.handleSpitball(source, target, logMessage, unlockAnimal);

			expect(target.hp).toBe(3);
			expect(logMessage).toHaveBeenCalledWith('It missed! 0 damage.', 2);
		});
	});

	describe('handleStrike', () => {
		it('attacks two targets for 1 damage each', () => {
			const {result} = renderHook(() => useGameActions());
			const source = createTestPlayer(1, 'Striker', 'Tiger');
			const target1 = createTestPlayer(2, 'Target1', 'Coyote');
			const target2 = createTestPlayer(3, 'Target2', 'Llama');
			const logMessage = vi.fn();
			const unlockAnimal = vi.fn();

			result.current.handleStrike(source, target1, target2, logMessage, unlockAnimal);

			expect(target1.hp).toBe(2);
			expect(target2.hp).toBe(2);
			expect(sound.playSound).toHaveBeenCalledWith('strike');
			expect(logMessage).toHaveBeenCalledWith('Striker the Tiger uses Strike on Target1 and Target2!', 1);
		});
	});

	describe('handleRampage', () => {
		it('deals 4 damage to target', () => {
			const {result} = renderHook(() => useGameActions());
			const source = createTestPlayer(1, 'Rampager', 'Gorilla');
			const target = createTestPlayer(2, 'Target', 'Coyote');
			const logMessage = vi.fn();
			const unlockAnimal = vi.fn();

			result.current.handleRampage(source, target, logMessage, unlockAnimal);

			expect(target.hp).toBe(0);
			expect(target.isAlive).toBe(false);
			expect(source.oneTimeActions.hasUsedAbility).toBe(true);
			expect(sound.playSound).toHaveBeenCalledWith('rampage');
			expect(logMessage).toHaveBeenCalledWith(
				'Rampager the Gorilla unleashes a devastating Rampage on Target (Coyote)!',
				1,
			);
			expect(unlockAnimal).toHaveBeenCalledWith('Coyote');
		});
	});

	describe('handleMischief', () => {
		it('permanently disables target ability', () => {
			const {result} = renderHook(() => useGameActions());
			const source = createTestPlayer(1, 'Prankster', 'Monkey');
			const target = createTestPlayer(2, 'Target', 'Coyote');
			const logMessage = vi.fn();

			result.current.handleMischief(source, target, logMessage);

			expect(source.oneTimeActions.hasUsedAbility).toBe(true);
			expect(target.abilityDisabled).toBe(true);
			expect(sound.playSound).toHaveBeenCalledWith('mischief');
			expect(logMessage).toHaveBeenCalledWith('Prankster the Monkey uses Mischief on Target (Coyote)!', 1);
			expect(logMessage).toHaveBeenCalledWith("Target's (Coyote) ability has been permanently disabled!", 2);
		});
	});
});
