import type {Meta, StoryObj} from '@storybook/react-vite';
import {useState} from 'react';
import {ModeSelector, type GameMode} from './ModeSelector';

const meta = {
	title: 'Components/ModeSelector',
	component: ModeSelector,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		selectedMode: {
			control: 'select',
			options: ['standard', 'challenger'],
		},
		disabled: {
			control: 'boolean',
		},
	},
} satisfies Meta<typeof ModeSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StandardSelected: Story = {
	args: {
		selectedMode: 'standard',
		onModeChange: (mode: GameMode) => {
			console.log('Mode changed to:', mode);
		},
	},
};

export const ChallengerSelected: Story = {
	args: {
		selectedMode: 'challenger',
		onModeChange: (mode: GameMode) => {
			console.log('Mode changed to:', mode);
		},
	},
};

export const Disabled: Story = {
	args: {
		selectedMode: 'standard',
		disabled: true,
		onModeChange: (mode: GameMode) => {
			console.log('Mode changed to:', mode);
		},
	},
};

export const Interactive = {
	render: () => {
		const InteractiveExample = () => {
			const [selectedMode, setSelectedMode] = useState<GameMode>('standard');

			return (
				<div style={{padding: '20px'}}>
					<ModeSelector
						selectedMode={selectedMode}
						onModeChange={setSelectedMode}
					/>
					<p style={{marginTop: '20px', textAlign: 'center'}}>
						Selected mode: <strong>{selectedMode}</strong>
					</p>
				</div>
			);
		};

		return <InteractiveExample />;
	},
};

export const AllStates = {
	render: () => (
		<div style={{display: 'flex', flexDirection: 'column', gap: '40px', padding: '20px'}}>
			<div>
				<h3>Standard Mode Selected</h3>
				<ModeSelector
					selectedMode="standard"
					onModeChange={(mode: GameMode) => {
						console.log('Mode changed to:', mode);
					}}
				/>
			</div>

			<div>
				<h3>Challenger Mode Selected</h3>
				<ModeSelector
					selectedMode="challenger"
					onModeChange={(mode: GameMode) => {
						console.log('Mode changed to:', mode);
					}}
				/>
			</div>

			<div>
				<h3>Disabled State</h3>
				<ModeSelector
					selectedMode="standard"
					disabled
					onModeChange={(mode: GameMode) => {
						console.log('Mode changed to:', mode);
					}}
				/>
			</div>
		</div>
	),
};
