import type {Meta, StoryObj} from '@storybook/react';
import {expect, userEvent, within, fn} from 'storybook/test';
import {GameScreen} from './GameScreen';
import type {Player, LogEntry} from '../../lib/types';

const meta = {
	title: 'Screens/GameScreen',
	component: GameScreen,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof GameScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const createPlayer = (
	id: number,
	name: string,
	animal: 'Coyote' | 'Llama' | 'Tiger' | 'Gorilla' | 'Monkey',
	hp: number,
	maxHp: number,
	isComputer = false,
	status = {isShielded: false, isSleeping: false, sleepTurnsRemaining: 0},
	abilityCooldown = 0,
): Player => ({
	id,
	name,
	animal,
	hp,
	maxHp,
	isAlive: hp > 0,
	isComputer,
	status,
	oneTimeActions: {
		hasHealed: false,
		hasShielded: false,
		hasUsedAbility: false,
	},
	abilityCooldown,
	abilityDisabled: false,
});

const basicLogEntries: LogEntry[] = [
	{message: 'Turn 1:', indent: 0},
	{message: "Alice's turn", indent: 1},
	{message: 'Alice attacks Bob', indent: 2},
	{message: 'Bob takes 10 damage', indent: 3},
	{message: 'Turn 2:', indent: 0},
	{message: "Bob's turn", indent: 1},
	{message: 'Bob uses ability: Spitball', indent: 2},
	{message: 'Alice takes 5 damage', indent: 3},
	{message: 'Charlie takes 5 damage', indent: 3},
];

const extendedLogEntries: LogEntry[] = [
	{message: 'Turn 1:', indent: 0},
	{message: "Alice's turn", indent: 1},
	{message: 'Alice attacks Bob', indent: 2},
	{message: 'Bob takes 10 damage', indent: 3},
	{message: 'Turn 2:', indent: 0},
	{message: "Bob's turn", indent: 1},
	{message: 'Bob uses ability: Spitball', indent: 2},
	{message: 'Alice takes 5 damage', indent: 3},
	{message: 'Charlie takes 5 damage', indent: 3},
	{message: 'Turn 3:', indent: 0},
	{message: "Charlie's turn", indent: 1},
	{message: 'Charlie heals', indent: 2},
	{message: 'Charlie gains 15 HP', indent: 3},
	{message: 'Turn 4:', indent: 0},
	{message: "Dave's turn", indent: 1},
	{message: 'Dave shields', indent: 2},
	{message: 'Dave is now shielded', indent: 3},
	{message: 'Turn 5:', indent: 0},
	{message: "Alice's turn", indent: 1},
	{message: 'Alice attacks Dave', indent: 2},
	{message: 'Dave blocks attack with shield', indent: 3},
	{message: 'Shield is now broken', indent: 3},
];

export const StandardGameInProgress: Story = {
	args: {
		players: [
			createPlayer(1, 'Alice', 'Coyote', 90, 100),
			createPlayer(2, 'Bob', 'Llama', 85, 100),
			createPlayer(3, 'Charlie', 'Tiger', 100, 100),
			createPlayer(4, 'Dave', 'Gorilla', 100, 100),
		],
		currentPlayerIndex: 0,
		turnIndicator: "Alice's Turn",
		currentAnimal: 'Coyote',
		canAttack: true,
		canUseAbility: true,
		canHeal: true,
		canShield: true,
		canDoNothing: true,
		canUndo: true,
		healsRemaining: 1,
		shieldsRemaining: 1,
		logEntries: basicLogEntries,
		isGameOver: false,
		selectablePlayerIds: [],
		onPlayerClick: fn(),
		onAttack: fn(),
		onUseAbility: fn(),
		onHeal: fn(),
		onShield: fn(),
		onDoNothing: fn(),
		onUndo: fn(),
		onCopyToClipboard: fn(),
		onSaveLog: fn(),
	},
	play: async ({canvasElement, args}) => {
		const canvas = within(canvasElement);

		await expect(canvas.getByText("Alice's Turn")).toBeInTheDocument();

		const attackButton = canvas.getByRole('button', {name: 'Attack'});
		await expect(attackButton).toBeEnabled();

		if (attackButton) {
			await userEvent.click(attackButton);
		}
		await expect(args.onAttack).toHaveBeenCalledTimes(1);
	},
};

export const WithTargetSelection: Story = {
	args: {
		players: [
			createPlayer(1, 'Alice', 'Coyote', 90, 100),
			createPlayer(2, 'Bob', 'Llama', 85, 100),
			createPlayer(3, 'Charlie', 'Tiger', 100, 100),
			createPlayer(4, 'Dave', 'Gorilla', 100, 100),
		],
		currentPlayerIndex: 0,
		turnIndicator: "Alice's Turn - Select a target",
		currentAnimal: 'Coyote',
		canAttack: false,
		canUseAbility: false,
		canHeal: false,
		canShield: false,
		canDoNothing: false,
		canUndo: true,
		healsRemaining: 1,
		shieldsRemaining: 1,
		logEntries: basicLogEntries,
		isGameOver: false,
		selectablePlayerIds: [2, 3, 4],
		onPlayerClick: fn(),
		onUndo: fn(),
		onCopyToClipboard: fn(),
		onSaveLog: fn(),
	},
	play: async ({canvasElement, args}) => {
		const canvas = within(canvasElement);

		await expect(canvas.getByText("Alice's Turn - Select a target")).toBeInTheDocument();

		const bobCard = canvas.getByText('Bob');
		await userEvent.click(bobCard);
		await expect(args.onPlayerClick).toHaveBeenCalledWith(2);
	},
};

export const WithStatusEffects: Story = {
	args: {
		players: [
			createPlayer(1, 'Alice', 'Coyote', 60, 100),
			createPlayer(2, 'Bob', 'Llama', 75, 100, false, {isShielded: true, isSleeping: false, sleepTurnsRemaining: 0}),
			createPlayer(3, 'Charlie', 'Tiger', 40, 100, false, {isShielded: false, isSleeping: true, sleepTurnsRemaining: 1}),
			createPlayer(4, 'Dave', 'Gorilla', 100, 100, false, {isShielded: false, isSleeping: false, sleepTurnsRemaining: 0}, 2),
		],
		currentPlayerIndex: 1,
		turnIndicator: "Bob's Turn",
		currentAnimal: 'Llama',
		canAttack: true,
		canUseAbility: true,
		canHeal: true,
		canShield: false,
		canDoNothing: true,
		canUndo: true,
		healsRemaining: 1,
		shieldsRemaining: 0,
		logEntries: extendedLogEntries,
		isGameOver: false,
		selectablePlayerIds: [],
		onPlayerClick: fn(),
		onAttack: fn(),
		onUseAbility: fn(),
		onHeal: fn(),
		onShield: fn(),
		onDoNothing: fn(),
		onUndo: fn(),
		onCopyToClipboard: fn(),
		onSaveLog: fn(),
	},
	play: async ({canvasElement, args}) => {
		const canvas = within(canvasElement);

		const healButton = canvas.getByRole('button', {name: 'Heal (1)'});
		await expect(healButton).toBeEnabled();

		const shieldButton = canvas.getByRole('button', {name: 'Shield (0)'});
		await expect(shieldButton).toBeDisabled();

		if (healButton) {
			await userEvent.click(healButton);
		}
		await expect(args.onHeal).toHaveBeenCalledTimes(1);
	},
};

export const LowHealthPlayers: Story = {
	args: {
		players: [
			createPlayer(1, 'Alice', 'Coyote', 15, 100),
			createPlayer(2, 'Bob', 'Llama', 5, 100),
			createPlayer(3, 'Charlie', 'Tiger', 0, 100),
			createPlayer(4, 'Dave', 'Gorilla', 45, 100),
		],
		currentPlayerIndex: 3,
		turnIndicator: "Dave's Turn",
		currentAnimal: 'Gorilla',
		canAttack: true,
		canUseAbility: true,
		canHeal: false,
		canShield: false,
		canDoNothing: true,
		canUndo: true,
		healsRemaining: 0,
		shieldsRemaining: 0,
		logEntries: extendedLogEntries,
		isGameOver: false,
		selectablePlayerIds: [],
		onPlayerClick: (playerId: number) => console.log('Player clicked:', playerId),
		onAttack: () => console.log('Attack clicked'),
		onUseAbility: () => console.log('Use Ability clicked'),
		onHeal: () => console.log('Heal clicked'),
		onShield: () => console.log('Shield clicked'),
		onDoNothing: () => console.log('Do Nothing clicked'),
		onUndo: () => console.log('Undo clicked'),
		onCopyToClipboard: () => console.log('Copy to Clipboard clicked'),
		onSaveLog: () => console.log('Save Log clicked'),
	},
};

export const TwoPlayerGame: Story = {
	args: {
		players: [createPlayer(1, 'Alice', 'Tiger', 85, 100), createPlayer(2, 'Bob', 'Gorilla', 70, 100)],
		currentPlayerIndex: 0,
		turnIndicator: "Alice's Turn",
		currentAnimal: 'Tiger',
		canAttack: true,
		canUseAbility: true,
		canHeal: true,
		canShield: true,
		canDoNothing: true,
		canUndo: false,
		healsRemaining: 1,
		shieldsRemaining: 1,
		logEntries: [
			{message: 'Turn 1:', indent: 0},
			{message: "Alice's turn", indent: 1},
			{message: 'Alice attacks Bob', indent: 2},
			{message: 'Bob takes 10 damage', indent: 3},
		],
		isGameOver: false,
		selectablePlayerIds: [],
		onPlayerClick: (playerId: number) => console.log('Player clicked:', playerId),
		onAttack: () => console.log('Attack clicked'),
		onUseAbility: () => console.log('Use Ability clicked'),
		onHeal: () => console.log('Heal clicked'),
		onShield: () => console.log('Shield clicked'),
		onDoNothing: () => console.log('Do Nothing clicked'),
		onUndo: () => console.log('Undo clicked'),
		onCopyToClipboard: () => console.log('Copy to Clipboard clicked'),
		onSaveLog: () => console.log('Save Log clicked'),
	},
};

export const ChallengerMode: Story = {
	args: {
		players: [createPlayer(1, 'You', 'Monkey', 65, 100), createPlayer(2, 'Tiger', 'Tiger', 80, 100, true)],
		currentPlayerIndex: 0,
		turnIndicator: 'Your Turn',
		currentAnimal: 'Monkey',
		canAttack: true,
		canUseAbility: true,
		canHeal: true,
		canShield: true,
		canDoNothing: true,
		canUndo: true,
		healsRemaining: 1,
		shieldsRemaining: 1,
		logEntries: [
			{message: 'Turn 1:', indent: 0},
			{message: 'Your turn', indent: 1},
			{message: 'You attack Tiger', indent: 2},
			{message: 'Tiger takes 10 damage', indent: 3},
			{message: 'Turn 2:', indent: 0},
			{message: "Tiger's turn", indent: 1},
			{message: 'Tiger uses ability: Ferocious Strike', indent: 2},
			{message: 'You take 20 damage', indent: 3},
			{message: 'Turn 3:', indent: 0},
			{message: 'Your turn', indent: 1},
			{message: 'You use ability: Mischief', indent: 2},
			{message: 'Tiger is now sleeping', indent: 3},
		],
		isGameOver: false,
		selectablePlayerIds: [],
		onPlayerClick: (playerId: number) => console.log('Player clicked:', playerId),
		onAttack: () => console.log('Attack clicked'),
		onUseAbility: () => console.log('Use Ability clicked'),
		onHeal: () => console.log('Heal clicked'),
		onShield: () => console.log('Shield clicked'),
		onDoNothing: () => console.log('Do Nothing clicked'),
		onUndo: () => console.log('Undo clicked'),
		onCopyToClipboard: () => console.log('Copy to Clipboard clicked'),
		onSaveLog: () => console.log('Save Log clicked'),
	},
};

export const GameOverSingleWinner: Story = {
	args: {
		players: [
			createPlayer(1, 'Alice', 'Coyote', 55, 100),
			createPlayer(2, 'Bob', 'Llama', 0, 100),
			createPlayer(3, 'Charlie', 'Tiger', 0, 100),
			createPlayer(4, 'Dave', 'Gorilla', 0, 100),
		],
		currentPlayerIndex: 0,
		turnIndicator: "Alice's Turn",
		currentAnimal: 'Coyote',
		canAttack: false,
		canUseAbility: false,
		canHeal: false,
		canShield: false,
		canDoNothing: false,
		canUndo: false,
		healsRemaining: 0,
		shieldsRemaining: 0,
		logEntries: extendedLogEntries,
		isGameOver: true,
		winnerAnnouncement: '🎉 Alice wins! 🎉',
		selectablePlayerIds: [],
		onPlayAgain: fn(),
		onCopyLog: fn(),
		onSaveGameLog: fn(),
		onCopyToClipboard: fn(),
		onSaveLog: fn(),
	},
	play: async ({canvasElement, args}) => {
		const canvas = within(canvasElement);

		await expect(canvas.getByText('🎉 Alice wins! 🎉')).toBeInTheDocument();

		const playAgainButton = canvas.getByText('Play Again');
		await expect(playAgainButton).toBeInTheDocument();

		await userEvent.click(playAgainButton);
		await expect(args.onPlayAgain).toHaveBeenCalledTimes(1);
	},
};

export const GameOverMultipleWinners: Story = {
	args: {
		players: [
			createPlayer(1, 'Alice', 'Coyote', 30, 100),
			createPlayer(2, 'Bob', 'Llama', 45, 100),
			createPlayer(3, 'Charlie', 'Tiger', 0, 100),
			createPlayer(4, 'Dave', 'Gorilla', 0, 100),
		],
		currentPlayerIndex: 0,
		turnIndicator: "Alice's Turn",
		currentAnimal: 'Coyote',
		canAttack: false,
		canUseAbility: false,
		canHeal: false,
		canShield: false,
		canDoNothing: false,
		canUndo: false,
		healsRemaining: 0,
		shieldsRemaining: 0,
		logEntries: extendedLogEntries,
		isGameOver: true,
		winnerAnnouncement: '🎉 Alice and Bob win! 🎉',
		selectablePlayerIds: [],
		onPlayAgain: () => console.log('Play Again clicked'),
		onCopyLog: () => console.log('Copy Log clicked'),
		onSaveGameLog: () => console.log('Save Game Log clicked'),
		onCopyToClipboard: () => console.log('Copy to Clipboard clicked'),
		onSaveLog: () => console.log('Save Log clicked'),
	},
};

export const ChallengerVictory: Story = {
	args: {
		players: [createPlayer(1, 'You', 'Monkey', 70, 100), createPlayer(2, 'Tiger', 'Tiger', 0, 100, true)],
		currentPlayerIndex: 0,
		turnIndicator: 'Your Turn',
		currentAnimal: 'Monkey',
		canAttack: false,
		canUseAbility: false,
		canHeal: false,
		canShield: false,
		canDoNothing: false,
		canUndo: false,
		healsRemaining: 0,
		shieldsRemaining: 0,
		logEntries: [
			{message: 'Turn 8:', indent: 0},
			{message: 'Your turn', indent: 1},
			{message: 'You attack Tiger', indent: 2},
			{message: 'Tiger takes 15 damage', indent: 3},
			{message: 'Tiger has been defeated!', indent: 3},
		],
		isGameOver: true,
		winnerAnnouncement: '🏆 You defeated the Tiger! 🏆',
		selectablePlayerIds: [],
		onPlayAgain: () => console.log('Play Again clicked'),
		onCopyLog: () => console.log('Copy Log clicked'),
		onSaveGameLog: () => console.log('Save Game Log clicked'),
		onCopyToClipboard: () => console.log('Copy to Clipboard clicked'),
		onSaveLog: () => console.log('Save Log clicked'),
	},
};

export const ChallengerDefeat: Story = {
	args: {
		players: [createPlayer(1, 'You', 'Monkey', 0, 100), createPlayer(2, 'Tiger', 'Tiger', 45, 100, true)],
		currentPlayerIndex: 1,
		turnIndicator: "Tiger's Turn",
		currentAnimal: 'Tiger',
		canAttack: false,
		canUseAbility: false,
		canHeal: false,
		canShield: false,
		canDoNothing: false,
		canUndo: false,
		healsRemaining: 0,
		shieldsRemaining: 0,
		logEntries: [
			{message: 'Turn 7:', indent: 0},
			{message: "Tiger's turn", indent: 1},
			{message: 'Tiger uses ability: Ferocious Strike', indent: 2},
			{message: 'You take 25 damage', indent: 3},
			{message: 'You have been defeated!', indent: 3},
		],
		isGameOver: true,
		winnerAnnouncement: '💀 The Tiger defeated you! 💀',
		selectablePlayerIds: [],
		onPlayAgain: () => console.log('Play Again clicked'),
		onCopyLog: () => console.log('Copy Log clicked'),
		onSaveGameLog: () => console.log('Save Game Log clicked'),
		onCopyToClipboard: () => console.log('Copy to Clipboard clicked'),
		onSaveLog: () => console.log('Save Log clicked'),
	},
};

export const NoActionsAvailable: Story = {
	args: {
		players: [createPlayer(1, 'Alice', 'Coyote', 90, 100), createPlayer(2, 'Bob', 'Llama', 85, 100)],
		currentPlayerIndex: 0,
		turnIndicator: "Alice's Turn",
		currentAnimal: 'Coyote',
		canAttack: false,
		canUseAbility: false,
		canHeal: false,
		canShield: false,
		canDoNothing: false,
		canUndo: false,
		healsRemaining: 0,
		shieldsRemaining: 0,
		logEntries: basicLogEntries,
		isGameOver: false,
		selectablePlayerIds: [],
		onCopyToClipboard: () => console.log('Copy to Clipboard clicked'),
		onSaveLog: () => console.log('Save Log clicked'),
	},
};
