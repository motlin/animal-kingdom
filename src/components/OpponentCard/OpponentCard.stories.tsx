import type {Meta, StoryObj} from '@storybook/react';
import {OpponentCard} from './OpponentCard';

const meta = {
	title: 'Components/OpponentCard',
	component: OpponentCard,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		opponentName: {
			control: 'select',
			options: ['Coyote', 'Llama', 'Tiger', 'Gorilla', 'Monkey'],
		},
	},
} satisfies Meta<typeof OpponentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Coyote: Story = {
	args: {
		opponentName: 'Coyote',
	},
};

export const Llama: Story = {
	args: {
		opponentName: 'Llama',
	},
};

export const Tiger: Story = {
	args: {
		opponentName: 'Tiger',
	},
};

export const Gorilla: Story = {
	args: {
		opponentName: 'Gorilla',
	},
};

export const Monkey: Story = {
	args: {
		opponentName: 'Monkey',
	},
};

export const AllOpponents = {
	render: () => (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
				gap: '20px',
				maxWidth: '900px',
				padding: '20px',
			}}
		>
			<OpponentCard opponentName="Coyote" />
			<OpponentCard opponentName="Llama" />
			<OpponentCard opponentName="Tiger" />
			<OpponentCard opponentName="Gorilla" />
			<OpponentCard opponentName="Monkey" />
		</div>
	),
};

export const ResponsiveLayout = {
	render: () => (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: '1fr 1fr',
				gap: '30px',
				maxWidth: '800px',
				padding: '20px',
			}}
		>
			<div style={{textAlign: 'center'}}>
				<h3 style={{marginBottom: '15px'}}>Player Selection</h3>
				<div
					style={{
						backgroundColor: '#fff',
						border: '2px solid var(--color-accent)',
						borderRadius: '10px',
						padding: '15px',
					}}
				>
					<div style={{fontWeight: 'bold', marginBottom: '8px'}}>Llama</div>
					<div style={{fontSize: '0.9em'}}>Spitball: An attack with random damage (0-2).</div>
				</div>
			</div>
			<div style={{textAlign: 'center'}}>
				<h3 style={{marginBottom: '15px'}}>Opponent</h3>
				<OpponentCard opponentName="Tiger" />
			</div>
		</div>
	),
};
