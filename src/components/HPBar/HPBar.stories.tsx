import type {Meta, StoryObj} from '@storybook/react-vite';
import {HPBar} from './HPBar';

const meta = {
	title: 'Components/HPBar',
	component: HPBar,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		currentHp: {
			control: {type: 'number', min: 0, max: 20},
		},
		maxHp: {
			control: {type: 'number', min: 1, max: 20},
		},
	},
} satisfies Meta<typeof HPBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Full: Story = {
	args: {
		currentHp: 20,
		maxHp: 20,
	},
	decorators: [
		(Story) => (
			<div style={{width: '300px'}}>
				<Story />
			</div>
		),
	],
};

export const Medium: Story = {
	args: {
		currentHp: 12,
		maxHp: 20,
	},
	decorators: [
		(Story) => (
			<div style={{width: '300px'}}>
				<Story />
			</div>
		),
	],
};

export const Low: Story = {
	args: {
		currentHp: 5,
		maxHp: 20,
	},
	decorators: [
		(Story) => (
			<div style={{width: '300px'}}>
				<Story />
			</div>
		),
	],
};

export const AlmostDead: Story = {
	args: {
		currentHp: 1,
		maxHp: 20,
	},
	decorators: [
		(Story) => (
			<div style={{width: '300px'}}>
				<Story />
			</div>
		),
	],
};

export const Dead: Story = {
	args: {
		currentHp: 0,
		maxHp: 20,
	},
	decorators: [
		(Story) => (
			<div style={{width: '300px'}}>
				<Story />
			</div>
		),
	],
};

export const ThresholdAt67Percent: Story = {
	args: {
		currentHp: 13,
		maxHp: 20,
	},
	decorators: [
		(Story) => (
			<div style={{width: '300px'}}>
				<Story />
			</div>
		),
	],
};

export const ThresholdAt66Percent: Story = {
	args: {
		currentHp: 13,
		maxHp: 20,
	},
	decorators: [
		(Story) => (
			<div style={{width: '300px'}}>
				<Story />
			</div>
		),
	],
};

export const ThresholdAt34Percent: Story = {
	args: {
		currentHp: 7,
		maxHp: 20,
	},
	decorators: [
		(Story) => (
			<div style={{width: '300px'}}>
				<Story />
			</div>
		),
	],
};

export const ThresholdAt33Percent: Story = {
	args: {
		currentHp: 7,
		maxHp: 20,
	},
	decorators: [
		(Story) => (
			<div style={{width: '300px'}}>
				<Story />
			</div>
		),
	],
};

export const AllLevels = {
	render: () => (
		<div style={{display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', width: '400px'}}>
			<div>
				<h4 style={{marginBottom: '10px'}}>Full HP (100%)</h4>
				<HPBar
					currentHp={20}
					maxHp={20}
				/>
			</div>
			<div>
				<h4 style={{marginBottom: '10px'}}>High HP (80%)</h4>
				<HPBar
					currentHp={16}
					maxHp={20}
				/>
			</div>
			<div>
				<h4 style={{marginBottom: '10px'}}>Medium HP (60%)</h4>
				<HPBar
					currentHp={12}
					maxHp={20}
				/>
			</div>
			<div>
				<h4 style={{marginBottom: '10px'}}>Low HP (30%)</h4>
				<HPBar
					currentHp={6}
					maxHp={20}
				/>
			</div>
			<div>
				<h4 style={{marginBottom: '10px'}}>Critical HP (10%)</h4>
				<HPBar
					currentHp={2}
					maxHp={20}
				/>
			</div>
			<div>
				<h4 style={{marginBottom: '10px'}}>Dead (0%)</h4>
				<HPBar
					currentHp={0}
					maxHp={20}
				/>
			</div>
		</div>
	),
};
