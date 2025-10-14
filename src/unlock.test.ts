import {describe, it, expect, beforeEach, vi} from 'vitest';
import {initializeState, createPlayer, setUnlockedAnimals, getNextLockedAnimal} from './game-state.ts';
import {endGame} from './game-flow.ts';

describe('Animal unlock order', () => {
	beforeEach(() => {
		document.body.innerHTML = `
			<div id="game-over-screen" style="display: none;">
				<h2 id="winner-announcement"></h2>
			</div>
		`;

		vi.mock('./sound.ts', () => ({
			playSound: vi.fn(),
		}));

		vi.mock('./ui.ts', () => ({
			showConfetti: vi.fn(),
		}));
	});

	it('returns Llama as next locked animal when only Coyote is unlocked', () => {
		setUnlockedAnimals(new Set(['Coyote']));

		const nextAnimal = getNextLockedAnimal();

		expect(nextAnimal).toBe('Llama');
	});

	it('returns Tiger as next locked animal when Coyote and Llama are unlocked', () => {
		setUnlockedAnimals(new Set(['Coyote', 'Llama']));

		const nextAnimal = getNextLockedAnimal();

		expect(nextAnimal).toBe('Tiger');
	});

	it('returns Gorilla as next locked animal when Coyote, Llama, and Tiger are unlocked', () => {
		setUnlockedAnimals(new Set(['Coyote', 'Llama', 'Tiger']));

		const nextAnimal = getNextLockedAnimal();

		expect(nextAnimal).toBe('Gorilla');
	});

	it('returns Monkey as next locked animal when Coyote, Llama, Tiger, and Gorilla are unlocked', () => {
		setUnlockedAnimals(new Set(['Coyote', 'Llama', 'Tiger', 'Gorilla']));

		const nextAnimal = getNextLockedAnimal();

		expect(nextAnimal).toBe('Monkey');
	});

	it('returns null when all animals are unlocked', () => {
		setUnlockedAnimals(new Set(['Coyote', 'Llama', 'Tiger', 'Gorilla', 'Monkey']));

		const nextAnimal = getNextLockedAnimal();

		expect(nextAnimal).toBe(null);
	});

	it('unlocks opponent animal when player wins in challenger mode', () => {
		setUnlockedAnimals(new Set(['Coyote']));

		const player = createPlayer(0, 'You', 'Coyote', false);
		const opponent = createPlayer(1, 'Challenger', 'Llama', true);

		initializeState([player, opponent], 'challenger');

		endGame(player);

		const nextAnimal = getNextLockedAnimal();
		expect(nextAnimal).toBe('Tiger');
	});

	it('does not unlock opponent animal when computer wins in challenger mode', () => {
		setUnlockedAnimals(new Set(['Coyote']));

		const player = createPlayer(0, 'You', 'Coyote', false);
		const opponent = createPlayer(1, 'Challenger', 'Llama', true);

		initializeState([player, opponent], 'challenger');

		endGame(opponent);

		const nextAnimal = getNextLockedAnimal();
		expect(nextAnimal).toBe('Llama');
	});

	it('does not unlock animals in standard mode', () => {
		setUnlockedAnimals(new Set(['Coyote']));

		const player1 = createPlayer(0, 'Player 1', 'Coyote', false);
		const player2 = createPlayer(1, 'Player 2', 'Llama', false);

		initializeState([player1, player2], 'standard');

		endGame(player1);

		const nextAnimal = getNextLockedAnimal();
		expect(nextAnimal).toBe('Llama');
	});
});
