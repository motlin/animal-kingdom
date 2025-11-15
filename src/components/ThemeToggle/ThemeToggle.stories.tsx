import type {Meta, StoryObj} from '@storybook/react-vite';
import {ThemeToggle} from './ThemeToggle';

const meta = {
	title: 'Components/ThemeToggle',
	component: ThemeToggle,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightMode: Story = {
	args: {
		theme: 'light',
		onToggle: () => {},
	},
};

export const DarkMode: Story = {
	args: {
		theme: 'dark',
		onToggle: () => {},
	},
};
