import type {Meta, StoryObj} from '@storybook/react';
import {AnimalAbilities} from './AnimalAbilities';

const meta = {
	title: 'Components/AnimalAbilities',
	component: AnimalAbilities,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
	argTypes: {
		unlockedCount: {
			control: {type: 'number', min: 0, max: 5},
			description: 'Number of animals unlocked (0-5)',
		},
		defaultExpanded: {
			control: 'boolean',
			description: 'Whether the abilities list is expanded by default',
		},
	},
} satisfies Meta<typeof AnimalAbilities>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {
	args: {
		unlockedCount: 5,
		defaultExpanded: false,
	},
};

export const Expanded: Story = {
	args: {
		unlockedCount: 5,
		defaultExpanded: true,
	},
};

export const OneAnimalUnlocked: Story = {
	args: {
		unlockedCount: 1,
		defaultExpanded: true,
	},
};

export const TwoAnimalsUnlocked: Story = {
	args: {
		unlockedCount: 2,
		defaultExpanded: true,
	},
};

export const ThreeAnimalsUnlocked: Story = {
	args: {
		unlockedCount: 3,
		defaultExpanded: true,
	},
};

export const FourAnimalsUnlocked: Story = {
	args: {
		unlockedCount: 4,
		defaultExpanded: true,
	},
};

export const AllAnimalsUnlocked: Story = {
	args: {
		unlockedCount: 5,
		defaultExpanded: true,
	},
};

export const NoAnimalsUnlocked: Story = {
	args: {
		unlockedCount: 0,
		defaultExpanded: true,
	},
};
