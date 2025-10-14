import type {Meta, StoryObj} from '@storybook/react';
import {expect, userEvent, within, fn} from '@storybook/test';
import {GameControls} from './GameControls';

const meta = {
	title: 'Components/GameControls',
	component: GameControls,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
	decorators: [
		(Story) => (
			<div style={{maxWidth: '600px'}}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof GameControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllEnabled: Story = {
	args: {
		turnIndicator: "It's Alice's (Tiger) turn!",
		currentAnimal: 'Tiger',
		canAttack: true,
		canUseAbility: true,
		canHeal: true,
		canShield: true,
		canDoNothing: true,
		canUndo: true,
		healsRemaining: 1,
		shieldsRemaining: 1,
		onAttack: fn(),
		onUseAbility: fn(),
		onHeal: fn(),
		onShield: fn(),
		onDoNothing: fn(),
		onUndo: fn(),
	},
	play: async ({canvasElement, args}) => {
		const canvas = within(canvasElement);

		await expect(canvas.getByText("It's Alice's (Tiger) turn!")).toBeInTheDocument();

		const attackButton = canvas.getByRole('button', {name: /Attack/i});
		await expect(attackButton).toBeEnabled();

		if (attackButton) {
			await userEvent.click(attackButton);
		}
		await expect(args.onAttack).toHaveBeenCalledTimes(1);
	},
};

export const AbilityDisabled: Story = {
	args: {
		turnIndicator: "It's Alice's (Coyote) turn!",
		currentAnimal: 'Coyote',
		canAttack: true,
		canUseAbility: false,
		canHeal: true,
		canShield: true,
		canDoNothing: true,
		canUndo: true,
		healsRemaining: 1,
		shieldsRemaining: 1,
		onAttack: fn(),
		onUseAbility: fn(),
		onHeal: fn(),
		onShield: fn(),
		onDoNothing: fn(),
		onUndo: fn(),
	},
	play: async ({canvasElement, args}) => {
		const canvas = within(canvasElement);

		const abilityButton = canvas.getByRole('button', {name: /Use Ability:/i});
		await expect(abilityButton).toBeDisabled();

		const healButton = canvas.getByRole('button', {name: /Heal/i});
		await userEvent.click(healButton);
		await expect(args.onHeal).toHaveBeenCalledTimes(1);
	},
};

export const HealUsed: Story = {
	args: {
		turnIndicator: "It's Bob's (Llama) turn!",
		currentAnimal: 'Llama',
		canAttack: true,
		canUseAbility: true,
		canHeal: false,
		canShield: true,
		canDoNothing: true,
		canUndo: true,
		healsRemaining: 0,
		shieldsRemaining: 1,
		onAttack: fn(),
		onUseAbility: fn(),
		onHeal: fn(),
		onShield: fn(),
		onDoNothing: fn(),
		onUndo: fn(),
	},
	play: async ({canvasElement, args}) => {
		const canvas = within(canvasElement);

		const healButton = canvas.getByRole('button', {name: 'Heal (0)'});
		await expect(healButton).toBeDisabled();

		const shieldButton = canvas.getByRole('button', {name: 'Shield (1)'});
		await userEvent.click(shieldButton);
		await expect(args.onShield).toHaveBeenCalledTimes(1);
	},
};

export const ShieldUsed: Story = {
	args: {
		turnIndicator: "It's Charlie's (Gorilla) turn!",
		currentAnimal: 'Gorilla',
		canAttack: true,
		canUseAbility: true,
		canHeal: true,
		canShield: false,
		canDoNothing: true,
		canUndo: true,
		healsRemaining: 1,
		shieldsRemaining: 0,
		onAttack: () => console.log('Attack clicked'),
		onUseAbility: () => console.log('Use Ability clicked'),
		onHeal: () => console.log('Heal clicked'),
		onShield: () => console.log('Shield clicked'),
		onDoNothing: () => console.log('Do Nothing clicked'),
		onUndo: () => console.log('Undo clicked'),
	},
};

export const BothHealAndShieldUsed: Story = {
	args: {
		turnIndicator: "It's Dave's (Monkey) turn!",
		currentAnimal: 'Monkey',
		canAttack: true,
		canUseAbility: true,
		canHeal: false,
		canShield: false,
		canDoNothing: true,
		canUndo: true,
		healsRemaining: 0,
		shieldsRemaining: 0,
		onAttack: () => console.log('Attack clicked'),
		onUseAbility: () => console.log('Use Ability clicked'),
		onHeal: () => console.log('Heal clicked'),
		onShield: () => console.log('Shield clicked'),
		onDoNothing: () => console.log('Do Nothing clicked'),
		onUndo: () => console.log('Undo clicked'),
	},
};

export const UndoDisabled: Story = {
	args: {
		turnIndicator: "It's Alice's (Coyote) turn!",
		currentAnimal: 'Coyote',
		canAttack: true,
		canUseAbility: true,
		canHeal: true,
		canShield: true,
		canDoNothing: true,
		canUndo: false,
		healsRemaining: 1,
		shieldsRemaining: 1,
		onAttack: fn(),
		onUseAbility: fn(),
		onHeal: fn(),
		onShield: fn(),
		onDoNothing: fn(),
		onUndo: fn(),
	},
	play: async ({canvasElement, args}) => {
		const canvas = within(canvasElement);

		const undoButton = canvas.getByRole('button', {name: /U ndo Last Action/i});
		await expect(undoButton).toBeDisabled();

		const doNothingButton = canvas.getByRole('button', {name: 'Do Nothing'});
		await userEvent.click(doNothingButton);
		await expect(args.onDoNothing).toHaveBeenCalledTimes(1);
	},
};

export const GameEnding: Story = {
	args: {
		turnIndicator: "It's Bob's (Tiger) turn!",
		currentAnimal: 'Tiger',
		canAttack: false,
		canUseAbility: false,
		canHeal: false,
		canShield: false,
		canDoNothing: false,
		canUndo: false,
		healsRemaining: 1,
		shieldsRemaining: 1,
		onAttack: fn(),
		onUseAbility: fn(),
		onHeal: fn(),
		onShield: fn(),
		onDoNothing: fn(),
		onUndo: fn(),
	},
	play: async ({canvasElement}) => {
		const canvas = within(canvasElement);

		const attackButton = canvas.getByRole('button', {name: 'Attack'});
		await expect(attackButton).toBeDisabled();

		const abilityButton = canvas.getByRole('button', {name: /Use Ability:/i});
		await expect(abilityButton).toBeDisabled();

		const healButton = canvas.getByRole('button', {name: 'Heal (1)'});
		await expect(healButton).toBeDisabled();

		const shieldButton = canvas.getByRole('button', {name: 'Shield (1)'});
		await expect(shieldButton).toBeDisabled();

		const doNothingButton = canvas.getByRole('button', {name: 'Do Nothing'});
		await expect(doNothingButton).toBeDisabled();

		const undoButton = canvas.getByRole('button', {name: /U ndo Last Action/i});
		await expect(undoButton).toBeDisabled();
	},
};

export const TargetSelectionPrompt: Story = {
	args: {
		turnIndicator: 'Select a target for your attack',
		currentAnimal: 'Llama',
		canAttack: true,
		canUseAbility: true,
		canHeal: true,
		canShield: true,
		canDoNothing: true,
		canUndo: true,
		healsRemaining: 1,
		shieldsRemaining: 1,
		onAttack: () => console.log('Attack clicked'),
		onUseAbility: () => console.log('Use Ability clicked'),
		onHeal: () => console.log('Heal clicked'),
		onShield: () => console.log('Shield clicked'),
		onDoNothing: () => console.log('Do Nothing clicked'),
		onUndo: () => console.log('Undo clicked'),
	},
};

export const AllAnimals = {
	render: () => (
		<div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
			<GameControls
				turnIndicator="It's Alice's (Coyote) turn!"
				currentAnimal="Coyote"
				healsRemaining={1}
				shieldsRemaining={1}
			/>
			<GameControls
				turnIndicator="It's Bob's (Llama) turn!"
				currentAnimal="Llama"
				healsRemaining={1}
				shieldsRemaining={1}
			/>
			<GameControls
				turnIndicator="It's Charlie's (Tiger) turn!"
				currentAnimal="Tiger"
				healsRemaining={1}
				shieldsRemaining={1}
			/>
			<GameControls
				turnIndicator="It's Dave's (Gorilla) turn!"
				currentAnimal="Gorilla"
				healsRemaining={1}
				shieldsRemaining={1}
			/>
			<GameControls
				turnIndicator="It's Eve's (Monkey) turn!"
				currentAnimal="Monkey"
				healsRemaining={1}
				shieldsRemaining={1}
			/>
		</div>
	),
};

export const WithoutCallbacks: Story = {
	args: {
		turnIndicator: "It's Alice's (Tiger) turn!",
		currentAnimal: 'Tiger',
		healsRemaining: 1,
		shieldsRemaining: 1,
	},
};
