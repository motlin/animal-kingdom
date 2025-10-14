import type {Meta, StoryObj} from '@storybook/react';
import {expect} from '@storybook/test';
import {handleHeal, handleShield, applyDamage} from '../actions';
import {createPlayer, initializeState, setUnlockedAnimals} from '../game-state';
import * as sound from '../sound';

const meta = {
	title: 'Logic/Actions',
	render: () => <div>Player actions logic tests</div>,
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

export const HealPlayerBelowMaxHP: Story = {
	play: async () => {
		document.body.innerHTML = '<div id="game-log"></div>';
		const testPlayer = createPlayer(0, 'Test', 'Coyote', false);
		initializeState([testPlayer]);
		setUnlockedAnimals(new Set());

		const player = createPlayer(0, 'Test Player', 'Coyote', false);
		player.hp = 1;

		handleHeal(player);

		await expect(player.hp).toBe(2);
		await expect(player.oneTimeActions.hasHealed).toBe(true);
	},
};

export const OverhealPlayerAtMaxHP: Story = {
	play: async () => {
		document.body.innerHTML = '<div id="game-log"></div>';
		const testPlayer = createPlayer(0, 'Test', 'Coyote', false);
		initializeState([testPlayer]);
		setUnlockedAnimals(new Set());

		const player = createPlayer(0, 'Test Player', 'Coyote', false);
		player.hp = 3;

		handleHeal(player);

		await expect(player.hp).toBe(4);
		await expect(player.oneTimeActions.hasHealed).toBe(true);
	},
};

export const MarkHealAsUsed: Story = {
	play: async () => {
		document.body.innerHTML = '<div id="game-log"></div>';
		const testPlayer = createPlayer(0, 'Test', 'Coyote', false);
		initializeState([testPlayer]);
		setUnlockedAnimals(new Set());

		const player = createPlayer(0, 'Test Player', 'Coyote', false);

		handleHeal(player);

		await expect(player.oneTimeActions.hasHealed).toBe(true);
	},
};

export const ActivateShieldForPlayer: Story = {
	play: async () => {
		document.body.innerHTML = '<div id="game-log"></div>';
		const testPlayer = createPlayer(0, 'Test', 'Coyote', false);
		initializeState([testPlayer]);
		setUnlockedAnimals(new Set());

		const player = createPlayer(0, 'Test Player', 'Coyote', false);

		handleShield(player);

		await expect(player.status.isShielded).toBe(true);
		await expect(player.oneTimeActions.hasShielded).toBe(true);
	},
};

export const MarkShieldAsUsed: Story = {
	play: async () => {
		document.body.innerHTML = '<div id="game-log"></div>';
		const testPlayer = createPlayer(0, 'Test', 'Coyote', false);
		initializeState([testPlayer]);
		setUnlockedAnimals(new Set());

		const player = createPlayer(0, 'Test Player', 'Coyote', false);

		handleShield(player);

		await expect(player.oneTimeActions.hasShielded).toBe(true);
	},
};

export const DealDamageToUnshieldedPlayer: Story = {
	play: async () => {
		document.body.innerHTML = '<div id="game-log"></div>';
		const testPlayer = createPlayer(0, 'Test', 'Coyote', false);
		initializeState([testPlayer]);
		setUnlockedAnimals(new Set());

		const target = createPlayer(0, 'Target', 'Coyote', false);
		const source = createPlayer(1, 'Source', 'Tiger', false);
		target.hp = 3;

		const damageDealt = applyDamage(target, 1, source);

		await expect(target.hp).toBe(2);
		await expect(damageDealt).toBe(1);
	},
};

export const BlockDamageWithShield: Story = {
	play: async () => {
		document.body.innerHTML = '<div id="game-log"></div>';
		const testPlayer = createPlayer(0, 'Test', 'Coyote', false);
		initializeState([testPlayer]);
		setUnlockedAnimals(new Set());

		const target = createPlayer(0, 'Target', 'Coyote', false);
		const source = createPlayer(1, 'Source', 'Tiger', false);
		target.hp = 3;
		target.status.isShielded = true;

		const damageDealt = applyDamage(target, 1, source);

		await expect(target.hp).toBe(3);
		await expect(damageDealt).toBe(0);
	},
};

export const DefeatPlayerWhenHPReachesZero: Story = {
	play: async () => {
		document.body.innerHTML = '<div id="game-log"></div>';
		const testPlayer = createPlayer(0, 'Test', 'Coyote', false);
		initializeState([testPlayer]);
		setUnlockedAnimals(new Set());

		const target = createPlayer(0, 'Target', 'Coyote', false);
		const source = createPlayer(1, 'Source', 'Tiger', false);
		target.hp = 1;

		applyDamage(target, 1, source);

		await expect(target.hp).toBe(0);
		await expect(target.isAlive).toBe(false);
	},
};

export const DoNotDealMoreDamageThanCurrentHP: Story = {
	play: async () => {
		document.body.innerHTML = '<div id="game-log"></div>';
		const testPlayer = createPlayer(0, 'Test', 'Coyote', false);
		initializeState([testPlayer]);
		setUnlockedAnimals(new Set());

		const target = createPlayer(0, 'Target', 'Coyote', false);
		const source = createPlayer(1, 'Source', 'Gorilla', false);
		target.hp = 2;

		const damageDealt = applyDamage(target, 4, source);

		await expect(target.hp).toBe(0);
		await expect(damageDealt).toBe(2);
	},
};
