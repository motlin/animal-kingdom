import type {Meta, StoryObj} from '@storybook/react';
import {Header} from './Header';

const meta = {
	title: 'Components/Header',
	component: Header,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
	decorators: [
		(Story) => (
			<div style={{padding: '20px', minHeight: '400px'}}>
				<Story />
			</div>
		),
	],
};

export const Normal: Story = {
	args: {
		isGameActive: false,
	},
	decorators: [
		(Story) => (
			<div style={{padding: '20px', minHeight: '400px'}}>
				<Story />
			</div>
		),
	],
};

export const GameActive: Story = {
	args: {
		isGameActive: true,
	},
	decorators: [
		(Story) => (
			<div style={{position: 'relative', minHeight: '600px', padding: '20px', backgroundColor: '#F5F5DC'}}>
				<Story />
				<div style={{marginTop: '150px', padding: '20px', backgroundColor: '#FFF8E7', borderRadius: '12px'}}>
					<h2>Game Screen Content</h2>
					<p>When the game is active, the header moves to the top-left corner in a smaller size.</p>
					<p>This allows the game content to take up the full screen while keeping the logo visible.</p>
				</div>
			</div>
		),
	],
};

export const Comparison = {
	render: () => (
		<div style={{display: 'flex', flexDirection: 'column', gap: '40px'}}>
			<div style={{border: '2px solid #ccc', padding: '20px'}}>
				<h3 style={{marginTop: 0}}>Normal State (Setup Screen)</h3>
				<Header isGameActive={false} />
			</div>
			<div style={{border: '2px solid #ccc', padding: '20px', position: 'relative', minHeight: '300px'}}>
				<h3 style={{position: 'absolute', top: '20px', right: '20px', margin: 0}}>Game Active State</h3>
				<Header isGameActive={true} />
				<div style={{marginTop: '150px', padding: '20px', backgroundColor: '#FFF8E7', borderRadius: '8px'}}>
					<p>Logo is now small and in the corner</p>
				</div>
			</div>
		</div>
	),
};
