import type {Meta, StoryObj} from '@storybook/react';
import {useState} from 'react';
import {ChallengerSetup} from './ChallengerSetup';
import type {AnimalType} from '../../types';

const meta = {
	title: 'Screens/ChallengerSetup',
	component: ChallengerSetup,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
	argTypes: {
		disabled: {
			control: 'boolean',
		},
	},
} satisfies Meta<typeof ChallengerSetup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CoyoteUnlocked: Story = {
	args: {
		selectedAnimal: null,
		unlockedAnimals: new Set(['Coyote']),
		opponentAnimal: null,
		onAnimalSelect: () => {},
	},
};

export const CoyoteSelected: Story = {
	args: {
		selectedAnimal: 'Coyote',
		unlockedAnimals: new Set(['Coyote']),
		opponentAnimal: null,
		onAnimalSelect: () => {},
	},
};

export const TwoAnimalsUnlocked: Story = {
	args: {
		selectedAnimal: null,
		unlockedAnimals: new Set(['Coyote', 'Llama']),
		opponentAnimal: 'Llama',
		onAnimalSelect: () => {},
	},
};

export const TwoAnimalsWithSelection: Story = {
	args: {
		selectedAnimal: 'Coyote',
		unlockedAnimals: new Set(['Coyote', 'Llama']),
		opponentAnimal: 'Llama',
		onAnimalSelect: () => {},
	},
};

export const ThreeAnimalsUnlocked: Story = {
	args: {
		selectedAnimal: 'Llama',
		unlockedAnimals: new Set(['Coyote', 'Llama', 'Tiger']),
		opponentAnimal: 'Tiger',
		onAnimalSelect: () => {},
	},
};

export const FourAnimalsUnlocked: Story = {
	args: {
		selectedAnimal: 'Tiger',
		unlockedAnimals: new Set(['Coyote', 'Llama', 'Tiger', 'Gorilla']),
		opponentAnimal: 'Gorilla',
		onAnimalSelect: () => {},
	},
};

export const AllAnimalsUnlocked: Story = {
	args: {
		selectedAnimal: 'Coyote',
		unlockedAnimals: new Set(['Coyote', 'Llama', 'Tiger', 'Gorilla', 'Monkey']),
		opponentAnimal: 'Monkey',
		onAnimalSelect: () => {},
	},
};

export const AllAnimalsNoSelection: Story = {
	args: {
		selectedAnimal: null,
		unlockedAnimals: new Set(['Coyote', 'Llama', 'Tiger', 'Gorilla', 'Monkey']),
		opponentAnimal: 'Monkey',
		onAnimalSelect: () => {},
	},
};

export const Disabled: Story = {
	args: {
		selectedAnimal: 'Tiger',
		unlockedAnimals: new Set(['Coyote', 'Llama', 'Tiger', 'Gorilla']),
		opponentAnimal: 'Gorilla',
		onAnimalSelect: () => {},
		disabled: true,
	},
};

export const Interactive = {
	render: () => {
		const InteractiveChallengerSetup = () => {
			const [selectedAnimal, setSelectedAnimal] = useState<AnimalType | null>(null);
			const unlockedAnimals: Set<AnimalType> = new Set(['Coyote', 'Llama', 'Tiger']);
			const opponentAnimal: AnimalType = 'Tiger';

			return (
				<div style={{padding: '20px', maxWidth: '1200px'}}>
					<h2 style={{marginBottom: '20px'}}>Challenger Mode Setup</h2>
					<ChallengerSetup
						selectedAnimal={selectedAnimal}
						unlockedAnimals={unlockedAnimals}
						opponentAnimal={opponentAnimal}
						onAnimalSelect={setSelectedAnimal}
					/>

					<div style={{marginTop: '30px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px'}}>
						<h3>Current Selection:</h3>
						<p>
							<strong>Selected Animal:</strong> {selectedAnimal || 'None'}
						</p>
						<p>
							<strong>Opponent:</strong> {opponentAnimal}
						</p>
					</div>
				</div>
			);
		};

		return <InteractiveChallengerSetup />;
	},
};

export const ProgressionDemo = {
	render: () => {
		const ProgressionDemoComponent = () => {
			const [selectedAnimal, setSelectedAnimal] = useState<AnimalType | null>(null);
			const [unlockedAnimals, setUnlockedAnimals] = useState<Set<AnimalType>>(new Set(['Coyote']));

			const allAnimals: AnimalType[] = ['Coyote', 'Llama', 'Tiger', 'Gorilla', 'Monkey'];
			const currentOpponent = allAnimals[unlockedAnimals.size - 1];

			const unlockNextAnimal = () => {
				if (unlockedAnimals.size < allAnimals.length) {
					const nextAnimal = allAnimals[unlockedAnimals.size];
					if (nextAnimal) {
						setUnlockedAnimals(new Set([...unlockedAnimals, nextAnimal]));
						setSelectedAnimal(null);
					}
				}
			};

			const resetProgress = () => {
				setUnlockedAnimals(new Set(['Coyote']));
				setSelectedAnimal(null);
			};

			return (
				<div style={{padding: '20px', maxWidth: '1200px'}}>
					<h2 style={{marginBottom: '20px'}}>Challenger Mode Progression</h2>
					<p style={{marginBottom: '20px'}}>
						This demonstrates how the challenger setup changes as you unlock more animals. Each time you
						win, you unlock a new animal and face the next challenger.
					</p>

					<ChallengerSetup
						selectedAnimal={selectedAnimal}
						unlockedAnimals={unlockedAnimals}
						opponentAnimal={currentOpponent || null}
						onAnimalSelect={setSelectedAnimal}
					/>

					<div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
						<button
							onClick={unlockNextAnimal}
							disabled={unlockedAnimals.size >= allAnimals.length}
							style={{
								padding: '10px 20px',
								backgroundColor: unlockedAnimals.size >= allAnimals.length ? '#ccc' : '#A0522D',
								color: 'white',
								border: 'none',
								borderRadius: '8px',
								cursor: unlockedAnimals.size >= allAnimals.length ? 'not-allowed' : 'pointer',
								fontFamily: 'Merriweather, serif',
							}}
						>
							Unlock Next Animal (Win)
						</button>
						<button
							onClick={resetProgress}
							style={{
								padding: '10px 20px',
								backgroundColor: '#6B4423',
								color: 'white',
								border: 'none',
								borderRadius: '8px',
								cursor: 'pointer',
								fontFamily: 'Merriweather, serif',
							}}
						>
							Reset Progress
						</button>
					</div>

					<div style={{marginTop: '30px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px'}}>
						<h3>Progress:</h3>
						<p>
							<strong>Unlocked Animals:</strong> {Array.from(unlockedAnimals).join(', ')} (
							{unlockedAnimals.size}/{allAnimals.length})
						</p>
						<p>
							<strong>Current Opponent:</strong> {currentOpponent || 'None'}
						</p>
						<p>
							<strong>Selected Fighter:</strong> {selectedAnimal || 'None'}
						</p>
					</div>
				</div>
			);
		};

		return <ProgressionDemoComponent />;
	},
};

export const AllVariants = {
	render: () => {
		const AllVariantsDemo = () => {
			return (
				<div style={{padding: '20px', maxWidth: '1200px'}}>
					<div style={{marginBottom: '40px'}}>
						<h3>Only Coyote Unlocked (No Challenger Yet)</h3>
						<ChallengerSetup
							selectedAnimal={null}
							unlockedAnimals={new Set(['Coyote'])}
							opponentAnimal={null}
							onAnimalSelect={() => {}}
						/>
					</div>

					<div style={{marginBottom: '40px'}}>
						<h3>Coyote Selected, Facing Llama</h3>
						<ChallengerSetup
							selectedAnimal="Coyote"
							unlockedAnimals={new Set(['Coyote', 'Llama'])}
							opponentAnimal="Llama"
							onAnimalSelect={() => {}}
						/>
					</div>

					<div style={{marginBottom: '40px'}}>
						<h3>Three Animals Unlocked</h3>
						<ChallengerSetup
							selectedAnimal="Llama"
							unlockedAnimals={new Set(['Coyote', 'Llama', 'Tiger'])}
							opponentAnimal="Tiger"
							onAnimalSelect={() => {}}
						/>
					</div>

					<div style={{marginBottom: '40px'}}>
						<h3>All Animals Unlocked - Final Challenger</h3>
						<ChallengerSetup
							selectedAnimal="Tiger"
							unlockedAnimals={new Set(['Coyote', 'Llama', 'Tiger', 'Gorilla', 'Monkey'])}
							opponentAnimal="Monkey"
							onAnimalSelect={() => {}}
						/>
					</div>

					<div style={{marginBottom: '40px'}}>
						<h3>Disabled State</h3>
						<ChallengerSetup
							selectedAnimal="Coyote"
							unlockedAnimals={new Set(['Coyote', 'Llama', 'Tiger'])}
							opponentAnimal="Tiger"
							onAnimalSelect={() => {}}
							disabled
						/>
					</div>
				</div>
			);
		};

		return <AllVariantsDemo />;
	},
};
