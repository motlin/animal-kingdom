import type {Meta, StoryObj} from '@storybook/react';
import {GameLog} from './GameLog';
import type {LogEntry} from '../../types';

const meta = {
	title: 'Components/GameLog',
	component: GameLog,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof GameLog>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleLogEntriesEmpty: LogEntry[] = [];

const sampleLogEntriesSimple: LogEntry[] = [
	{message: '🎮 Turn 1', indent: 0},
	{message: "Alice (Coyote)'s turn", indent: 1},
	{message: 'Alice attacks Bob for 10 damage', indent: 2},
	{message: '🎮 Turn 2', indent: 0},
	{message: "Bob (Llama)'s turn", indent: 1},
	{message: 'Bob heals for 5 HP', indent: 2},
];

const sampleLogEntriesComplex: LogEntry[] = [
	{message: '🎮 Turn 1', indent: 0},
	{message: "Alice (Coyote)'s turn", indent: 1},
	{message: 'Alice uses Howl ability', indent: 2},
	{message: 'Bob takes 3 damage', indent: 3},
	{message: 'Charlie takes 3 damage', indent: 3},
	{message: 'Dave takes 3 damage', indent: 3},
	{message: '🎮 Turn 2', indent: 0},
	{message: "Bob (Llama)'s turn", indent: 1},
	{message: 'Bob uses Spitball ability', indent: 2},
	{message: 'Charlie is put to sleep', indent: 3},
	{message: '🎮 Turn 3', indent: 0},
	{message: "Charlie (Tiger)'s turn", indent: 1},
	{message: 'Charlie is sleeping and skips turn', indent: 2},
	{message: '🎮 Turn 4', indent: 0},
	{message: "Dave (Gorilla)'s turn", indent: 1},
	{message: 'Dave uses Rampage ability', indent: 2},
	{message: 'Alice takes 12 damage', indent: 3},
	{message: 'Bob takes 12 damage', indent: 3},
	{message: 'Charlie takes 12 damage', indent: 3},
];

const sampleLogEntriesShieldAndHeal: LogEntry[] = [
	{message: '🎮 Turn 1', indent: 0},
	{message: "Alice (Coyote)'s turn", indent: 1},
	{message: 'Alice uses Shield', indent: 2},
	{message: 'Alice gains a shield', indent: 3},
	{message: '🎮 Turn 2', indent: 0},
	{message: "Bob (Llama)'s turn", indent: 1},
	{message: 'Bob attacks Alice for 10 damage', indent: 2},
	{message: 'Shield absorbed the damage', indent: 3},
	{message: '🎮 Turn 3', indent: 0},
	{message: "Alice (Coyote)'s turn", indent: 1},
	{message: 'Alice uses Heal', indent: 2},
	{message: 'Alice heals for 15 HP', indent: 3},
];

const sampleLogEntriesGameOver: LogEntry[] = [
	{message: '🎮 Turn 1', indent: 0},
	{message: "Alice (Coyote)'s turn", indent: 1},
	{message: 'Alice attacks Bob for 10 damage', indent: 2},
	{message: '🎮 Turn 2', indent: 0},
	{message: "Bob (Llama)'s turn", indent: 1},
	{message: 'Bob attacks Alice for 10 damage', indent: 2},
	{message: '🎮 Turn 3', indent: 0},
	{message: "Alice (Coyote)'s turn", indent: 1},
	{message: 'Alice attacks Bob for 10 damage', indent: 2},
	{message: '🎮 Turn 4', indent: 0},
	{message: "Bob (Llama)'s turn", indent: 1},
	{message: 'Bob attacks Alice for 10 damage', indent: 2},
	{message: '🎮 Turn 5', indent: 0},
	{message: "Alice (Coyote)'s turn", indent: 1},
	{message: 'Alice attacks Bob for 10 damage', indent: 2},
	{message: 'Bob has been defeated', indent: 3},
	{message: '🎮 Game Over', indent: 0},
	{message: 'Alice (Coyote) wins!', indent: 1},
];

const sampleLogEntriesLong: LogEntry[] = [
	{message: '🎮 Turn 1', indent: 0},
	{message: "Alice (Coyote)'s turn", indent: 1},
	{message: 'Alice attacks Bob for 10 damage', indent: 2},
	{message: '🎮 Turn 2', indent: 0},
	{message: "Bob (Llama)'s turn", indent: 1},
	{message: 'Bob attacks Charlie for 10 damage', indent: 2},
	{message: '🎮 Turn 3', indent: 0},
	{message: "Charlie (Tiger)'s turn", indent: 1},
	{message: 'Charlie attacks Dave for 10 damage', indent: 2},
	{message: '🎮 Turn 4', indent: 0},
	{message: "Dave (Gorilla)'s turn", indent: 1},
	{message: 'Dave attacks Alice for 10 damage', indent: 2},
	{message: '🎮 Turn 5', indent: 0},
	{message: "Alice (Coyote)'s turn", indent: 1},
	{message: 'Alice uses Howl ability', indent: 2},
	{message: 'Bob takes 3 damage', indent: 3},
	{message: 'Charlie takes 3 damage', indent: 3},
	{message: 'Dave takes 3 damage', indent: 3},
	{message: '🎮 Turn 6', indent: 0},
	{message: "Bob (Llama)'s turn", indent: 1},
	{message: 'Bob uses Spitball ability', indent: 2},
	{message: 'Charlie is put to sleep', indent: 3},
	{message: '🎮 Turn 7', indent: 0},
	{message: "Charlie (Tiger)'s turn", indent: 1},
	{message: 'Charlie is sleeping and skips turn', indent: 2},
	{message: '🎮 Turn 8', indent: 0},
	{message: "Dave (Gorilla)'s turn", indent: 1},
	{message: 'Dave uses Shield', indent: 2},
	{message: 'Dave gains a shield', indent: 3},
	{message: '🎮 Turn 9', indent: 0},
	{message: "Alice (Coyote)'s turn", indent: 1},
	{message: 'Alice attacks Dave for 10 damage', indent: 2},
	{message: 'Shield absorbed the damage', indent: 3},
	{message: '🎮 Turn 10', indent: 0},
	{message: "Bob (Llama)'s turn", indent: 1},
	{message: 'Bob attacks Alice for 10 damage', indent: 2},
	{message: '🎮 Turn 11', indent: 0},
	{message: "Charlie (Tiger)'s turn", indent: 1},
	{message: 'Charlie uses Strike ability', indent: 2},
	{message: 'Alice takes 8 damage', indent: 3},
	{message: 'Bob takes 8 damage', indent: 3},
	{message: '🎮 Turn 12', indent: 0},
	{message: "Dave (Gorilla)'s turn", indent: 1},
	{message: 'Dave uses Rampage ability', indent: 2},
	{message: 'Alice takes 12 damage', indent: 3},
	{message: 'Bob takes 12 damage', indent: 3},
	{message: 'Charlie takes 12 damage', indent: 3},
];

export const Empty: Story = {
	args: {
		entries: sampleLogEntriesEmpty,
		onCopyToClipboard: () => {
			alert('Copied to clipboard!');
		},
		onSaveLog: () => {
			alert('Log saved!');
		},
	},
};

export const Simple: Story = {
	args: {
		entries: sampleLogEntriesSimple,
		onCopyToClipboard: () => {
			alert('Copied to clipboard!');
		},
		onSaveLog: () => {
			alert('Log saved!');
		},
	},
};

export const Complex: Story = {
	args: {
		entries: sampleLogEntriesComplex,
		onCopyToClipboard: () => {
			alert('Copied to clipboard!');
		},
		onSaveLog: () => {
			alert('Log saved!');
		},
	},
};

export const ShieldAndHeal: Story = {
	args: {
		entries: sampleLogEntriesShieldAndHeal,
		onCopyToClipboard: () => {
			alert('Copied to clipboard!');
		},
		onSaveLog: () => {
			alert('Log saved!');
		},
	},
};

export const GameOver: Story = {
	args: {
		entries: sampleLogEntriesGameOver,
		onCopyToClipboard: () => {
			alert('Copied to clipboard!');
		},
		onSaveLog: () => {
			alert('Log saved!');
		},
	},
};

export const LongLog: Story = {
	args: {
		entries: sampleLogEntriesLong,
		onCopyToClipboard: () => {
			alert('Copied to clipboard!');
		},
		onSaveLog: () => {
			alert('Log saved!');
		},
	},
};

export const WithoutCallbacks: Story = {
	args: {
		entries: sampleLogEntriesSimple,
	},
};
