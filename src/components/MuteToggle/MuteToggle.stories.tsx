import type {Meta, StoryObj} from '@storybook/react-vite';
import {MuteToggle} from './MuteToggle';

const meta = {
	title: 'Components/MuteToggle',
	component: MuteToggle,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof MuteToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unmuted: Story = {
	args: {
		isMuted: false,
		onToggle: () => {},
	},
};

export const Muted: Story = {
	args: {
		isMuted: true,
		onToggle: () => {},
	},
};
