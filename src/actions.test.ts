import {describe, it, expect, beforeEach, vi} from 'vitest';
import {handleHeal, handleShield, applyDamage} from './actions.ts';
import {createPlayer} from './game-state.ts';

vi.mock('./sound.ts', () => ({
	playSound: vi.fn(),
}));

vi.mock('./game-state.ts', async (importOriginal) => {
	const actual = (await importOriginal()) as any;
	return {
		...actual,
		logMessage: vi.fn(),
		unlockAnimal: vi.fn(),
	};
});

describe('Player actions', () => {
	beforeEach(() => {
		document.body.innerHTML = '<div id="game-log"></div>';
	});

	describe('handleHeal', () => {
		it('heals player when below max HP', () => {
			const player = createPlayer(0, 'Test Player', 'Coyote', false);
			player.hp = 1;

			handleHeal(player);

			expect(player.hp).toBe(2);
			expect(player.oneTimeActions.hasHealed).toBe(true);
		});

		it('overheals player when at max HP', () => {
			const player = createPlayer(0, 'Test Player', 'Coyote', false);
			player.hp = 3;

			handleHeal(player);

			expect(player.hp).toBe(4);
			expect(player.oneTimeActions.hasHealed).toBe(true);
		});

		it('marks heal as used', () => {
			const player = createPlayer(0, 'Test Player', 'Coyote', false);

			handleHeal(player);

			expect(player.oneTimeActions.hasHealed).toBe(true);
		});
	});

	describe('handleShield', () => {
		it('activates shield for player', () => {
			const player = createPlayer(0, 'Test Player', 'Coyote', false);

			handleShield(player);

			expect(player.status.isShielded).toBe(true);
			expect(player.oneTimeActions.hasShielded).toBe(true);
		});

		it('marks shield as used', () => {
			const player = createPlayer(0, 'Test Player', 'Coyote', false);

			handleShield(player);

			expect(player.oneTimeActions.hasShielded).toBe(true);
		});
	});

	describe('applyDamage', () => {
		it('deals damage to unshielded player', () => {
			const target = createPlayer(0, 'Target', 'Coyote', false);
			const source = createPlayer(1, 'Source', 'Tiger', false);
			target.hp = 3;

			const damageDealt = applyDamage(target, 1, source);

			expect(target.hp).toBe(2);
			expect(damageDealt).toBe(1);
		});

		it('blocks damage with shield', () => {
			const target = createPlayer(0, 'Target', 'Coyote', false);
			const source = createPlayer(1, 'Source', 'Tiger', false);
			target.hp = 3;
			target.status.isShielded = true;

			const damageDealt = applyDamage(target, 1, source);

			expect(target.hp).toBe(3);
			expect(damageDealt).toBe(0);
		});

		it('defeats player when HP reaches zero', () => {
			const target = createPlayer(0, 'Target', 'Coyote', false);
			const source = createPlayer(1, 'Source', 'Tiger', false);
			target.hp = 1;

			applyDamage(target, 1, source);

			expect(target.hp).toBe(0);
			expect(target.isAlive).toBe(false);
		});

		it('does not deal more damage than current HP', () => {
			const target = createPlayer(0, 'Target', 'Coyote', false);
			const source = createPlayer(1, 'Source', 'Gorilla', false);
			target.hp = 2;

			const damageDealt = applyDamage(target, 4, source);

			expect(target.hp).toBe(0);
			expect(damageDealt).toBe(2);
		});
	});
});
