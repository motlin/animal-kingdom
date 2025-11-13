import type {Meta, StoryObj} from '@storybook/react';
import {useState} from 'react';
import {expect, userEvent, within, fn} from 'storybook/test';
import {SetupScreen} from './SetupScreen';
import type {PlayerConfiguration} from './StandardSetup';
import type {AnimalType} from '../../lib/types';
import type {GameMode} from '../../components/ModeSelector/ModeSelector';

const meta = {
	title: 'Screens/SetupScreen',
	component: SetupScreen,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof SetupScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const createDefaultPlayers = (): PlayerConfiguration[] => {
	const animals: AnimalType[] = ['Coyote', 'Llama', 'Tiger', 'Gorilla', 'Monkey'];
	return Array.from({length: 10}, (_, i) => ({
		name: '',
		animalType: animals[i % animals.length]!,
		playerType: 'human' as const,
	}));
};

export const StandardModeInitial: Story = {
	args: {
		mode: 'standard',
		unlockedAnimals: new Set(['Coyote', 'Llama', 'Tiger']),
		playerCount: 3,
		players: createDefaultPlayers(),
		selectedAnimal: null,
		opponentAnimal: null,
		onModeChange: fn(),
		onPlayerCountChange: fn(),
		onPlayerChange: fn(),
		onAnimalSelect: fn(),
		onStartGame: fn(),
		canStartGame: true,
	},
	play: async ({canvasElement, args}) => {
		const canvas = within(canvasElement);

		await expect(canvas.getByText('Game Setup')).toBeInTheDocument();
		await expect(canvas.getByText('Standard Battle')).toBeInTheDocument();

		const startButton = canvas.getByText('Start Game');
		await expect(startButton).toBeEnabled();

		await userEvent.click(startButton);
		await expect(args.onStartGame).toHaveBeenCalledTimes(1);
	},
};

export const StandardModeConfigured: Story = {
	args: {
		mode: 'standard',
		unlockedAnimals: new Set(['Coyote', 'Llama', 'Tiger']),
		playerCount: 4,
		players: [
			{name: 'Alice', animalType: 'Coyote', playerType: 'human'},
			{name: 'Bob', animalType: 'Llama', playerType: 'human'},
			{name: 'Charlie', animalType: 'Tiger', playerType: 'computer'},
			{name: 'Diana', animalType: 'Coyote', playerType: 'computer'},
			...createDefaultPlayers(),
		],
		selectedAnimal: null,
		opponentAnimal: null,
		onModeChange: () => {},
		onPlayerCountChange: () => {},
		onPlayerChange: () => {},
		onAnimalSelect: () => {},
		onStartGame: () => {},
		canStartGame: true,
	},
};

export const StandardModeTenPlayers: Story = {
	args: {
		mode: 'standard',
		unlockedAnimals: new Set(['Coyote', 'Llama', 'Tiger', 'Gorilla', 'Monkey']),
		playerCount: 10,
		players: createDefaultPlayers(),
		selectedAnimal: null,
		opponentAnimal: null,
		onModeChange: () => {},
		onPlayerCountChange: () => {},
		onPlayerChange: () => {},
		onAnimalSelect: () => {},
		onStartGame: () => {},
		canStartGame: true,
	},
};

export const ChallengerModeInitial: Story = {
	args: {
		mode: 'challenger',
		unlockedAnimals: new Set(['Coyote', 'Llama']),
		playerCount: 2,
		players: createDefaultPlayers(),
		selectedAnimal: null,
		opponentAnimal: 'Llama',
		onModeChange: fn(),
		onPlayerCountChange: fn(),
		onPlayerChange: fn(),
		onAnimalSelect: fn(),
		onStartGame: fn(),
		canStartGame: false,
	},
	play: async ({canvasElement, args}) => {
		const canvas = within(canvasElement);

		await expect(canvas.getByText('New Challenger')).toBeInTheDocument();

		const startButton = canvas.getByText('Start Game');
		await expect(startButton).toBeDisabled();

		const coyoteCard = canvas.getByText('Coyote');
		await userEvent.click(coyoteCard);
		await expect(args.onAnimalSelect).toHaveBeenCalledWith('Coyote');
	},
};

export const ChallengerModeSelected: Story = {
	args: {
		mode: 'challenger',
		unlockedAnimals: new Set(['Coyote', 'Llama', 'Tiger']),
		playerCount: 2,
		players: createDefaultPlayers(),
		selectedAnimal: 'Coyote',
		opponentAnimal: 'Tiger',
		onModeChange: fn(),
		onPlayerCountChange: fn(),
		onPlayerChange: fn(),
		onAnimalSelect: fn(),
		onStartGame: fn(),
		canStartGame: true,
	},
	play: async ({canvasElement, args}) => {
		const canvas = within(canvasElement);

		const startButton = canvas.getByText('Start Game');
		await expect(startButton).toBeEnabled();

		await userEvent.click(startButton);
		await expect(args.onStartGame).toHaveBeenCalledTimes(1);
	},
};

export const ChallengerModeAllUnlocked: Story = {
	args: {
		mode: 'challenger',
		unlockedAnimals: new Set(['Coyote', 'Llama', 'Tiger', 'Gorilla', 'Monkey']),
		playerCount: 2,
		players: createDefaultPlayers(),
		selectedAnimal: 'Tiger',
		opponentAnimal: 'Monkey',
		onModeChange: () => {},
		onPlayerCountChange: () => {},
		onPlayerChange: () => {},
		onAnimalSelect: () => {},
		onStartGame: () => {},
		canStartGame: true,
	},
};

export const ChallengerModeNoOpponent: Story = {
	args: {
		mode: 'challenger',
		unlockedAnimals: new Set(['Coyote']),
		playerCount: 2,
		players: createDefaultPlayers(),
		selectedAnimal: null,
		opponentAnimal: null,
		onModeChange: () => {},
		onPlayerCountChange: () => {},
		onPlayerChange: () => {},
		onAnimalSelect: () => {},
		onStartGame: () => {},
		canStartGame: false,
	},
};

export const StandardModeCannotStart: Story = {
	args: {
		mode: 'standard',
		unlockedAnimals: new Set(['Coyote']),
		playerCount: 2,
		players: createDefaultPlayers(),
		selectedAnimal: null,
		opponentAnimal: null,
		onModeChange: fn(),
		onPlayerCountChange: fn(),
		onPlayerChange: fn(),
		onAnimalSelect: fn(),
		onStartGame: fn(),
		canStartGame: false,
	},
	play: async ({canvasElement}) => {
		const canvas = within(canvasElement);

		const startButton = canvas.getByText('Start Game');
		await expect(startButton).toBeDisabled();
	},
};

export const Interactive = {
	render: () => {
		const InteractiveSetupScreen = () => {
			const [mode, setMode] = useState<GameMode>('standard');
			const [playerCount, setPlayerCount] = useState(3);
			const [players, setPlayers] = useState<PlayerConfiguration[]>(createDefaultPlayers());
			const [selectedAnimal, setSelectedAnimal] = useState<AnimalType | null>(null);

			const unlockedAnimals: Set<AnimalType> = new Set(['Coyote', 'Llama', 'Tiger']);
			const opponentAnimal: AnimalType | null = mode === 'challenger' ? 'Tiger' : null;

			const handlePlayerChange = (index: number, player: PlayerConfiguration) => {
				const newPlayers = [...players];
				newPlayers[index] = player;
				setPlayers(newPlayers);
			};

			const handleModeChange = (newMode: GameMode) => {
				setMode(newMode);
				if (newMode === 'challenger') {
					setSelectedAnimal(null);
				}
			};

			const handleStartGame = () => {
				console.log('Starting game with mode:', mode);
				if (mode === 'standard') {
					console.log('Players:', players.slice(0, playerCount));
				} else {
					console.log('Selected animal:', selectedAnimal);
					console.log('Opponent:', opponentAnimal);
				}
			};

			const canStartGame = mode === 'standard' ? true : selectedAnimal !== null && opponentAnimal !== null;

			return (
				<div style={{padding: '20px', maxWidth: '1200px', margin: '0 auto'}}>
					<SetupScreen
						mode={mode}
						unlockedAnimals={unlockedAnimals}
						playerCount={playerCount}
						players={players}
						selectedAnimal={selectedAnimal}
						opponentAnimal={opponentAnimal}
						onModeChange={handleModeChange}
						onPlayerCountChange={setPlayerCount}
						onPlayerChange={handlePlayerChange}
						onAnimalSelect={setSelectedAnimal}
						onStartGame={handleStartGame}
						canStartGame={canStartGame}
					/>

					<div style={{marginTop: '30px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px'}}>
						<h3>Current State:</h3>
						<p>
							<strong>Mode:</strong> {mode}
						</p>
						{mode === 'standard' ? (
							<div>
								<p>
									<strong>Player Count:</strong> {playerCount}
								</p>
								<p>
									<strong>Players:</strong>
								</p>
								<ul style={{marginTop: '5px', paddingLeft: '20px'}}>
									{players.slice(0, playerCount).map((player, index) => (
										<li key={index}>
											Player {index + 1}: {player.name || '(no name)'} - {player.animalType} -{' '}
											{player.playerType}
										</li>
									))}
								</ul>
							</div>
						) : (
							<div>
								<p>
									<strong>Selected Animal:</strong> {selectedAnimal || 'None'}
								</p>
								<p>
									<strong>Opponent:</strong> {opponentAnimal || 'None'}
								</p>
							</div>
						)}
						<p>
							<strong>Can Start Game:</strong> {canStartGame ? 'Yes' : 'No'}
						</p>
					</div>
				</div>
			);
		};

		return <InteractiveSetupScreen />;
	},
};

export const ModeSwitching: Story = {
	args: {
		mode: 'standard',
		unlockedAnimals: new Set(['Coyote', 'Llama', 'Tiger']),
		playerCount: 3,
		players: createDefaultPlayers(),
		selectedAnimal: null,
		opponentAnimal: null,
		onModeChange: fn(),
		onPlayerCountChange: fn(),
		onPlayerChange: fn(),
		onAnimalSelect: fn(),
		onStartGame: fn(),
		canStartGame: true,
	},
	play: async ({canvasElement, args}) => {
		const canvas = within(canvasElement);

		const standardButton = canvas.getByRole('button', {name: /Standard Battle/});
		await expect(standardButton).toHaveClass('active');

		const challengerButton = canvas.getByRole('button', {name: /New Challenger/});
		await userEvent.click(challengerButton);
		await expect(args.onModeChange).toHaveBeenCalledWith('challenger');
	},
};

export const ModeSwitchingDemo = {
	render: () => {
		const ModeSwitchingDemo = () => {
			const [mode, setMode] = useState<GameMode>('standard');
			const [playerCount, setPlayerCount] = useState(3);
			const [players, setPlayers] = useState<PlayerConfiguration[]>([
				{name: 'Alice', animalType: 'Coyote', playerType: 'human'},
				{name: 'Bob', animalType: 'Llama', playerType: 'human'},
				{name: 'Charlie', animalType: 'Tiger', playerType: 'computer'},
				...createDefaultPlayers(),
			]);
			const [selectedAnimal, setSelectedAnimal] = useState<AnimalType | null>(null);

			const unlockedAnimals: Set<AnimalType> = new Set(['Coyote', 'Llama', 'Tiger']);
			const opponentAnimal: AnimalType | null = mode === 'challenger' ? 'Tiger' : null;

			const handlePlayerChange = (index: number, player: PlayerConfiguration) => {
				const newPlayers = [...players];
				newPlayers[index] = player;
				setPlayers(newPlayers);
			};

			const handleModeChange = (newMode: GameMode) => {
				setMode(newMode);
				if (newMode === 'challenger') {
					setSelectedAnimal(null);
				}
			};

			const canStartGame = mode === 'standard' ? true : selectedAnimal !== null && opponentAnimal !== null;

			return (
				<div style={{padding: '20px', maxWidth: '1200px', margin: '0 auto'}}>
					<p style={{marginBottom: '20px', fontSize: '1.1em'}}>
						This demo shows how the setup screen changes when switching between Standard and Challenger
						modes. Player configurations in Standard mode are preserved when switching.
					</p>
					<SetupScreen
						mode={mode}
						unlockedAnimals={unlockedAnimals}
						playerCount={playerCount}
						players={players}
						selectedAnimal={selectedAnimal}
						opponentAnimal={opponentAnimal}
						onModeChange={handleModeChange}
						onPlayerCountChange={setPlayerCount}
						onPlayerChange={handlePlayerChange}
						onAnimalSelect={setSelectedAnimal}
						onStartGame={() => console.log('Start game')}
						canStartGame={canStartGame}
					/>
				</div>
			);
		};

		return <ModeSwitchingDemo />;
	},
};

export const AllVariants = {
	render: () => {
		const AllVariantsDemo = () => {
			return (
				<div style={{padding: '20px', maxWidth: '1200px', margin: '0 auto'}}>
					<div style={{marginBottom: '60px'}}>
						<h3>Standard Mode - Initial Setup (3 Players)</h3>
						<SetupScreen
							mode="standard"
							unlockedAnimals={new Set(['Coyote', 'Llama', 'Tiger'])}
							playerCount={3}
							players={createDefaultPlayers()}
							selectedAnimal={null}
							opponentAnimal={null}
							onModeChange={() => {}}
							onPlayerCountChange={() => {}}
							onPlayerChange={() => {}}
							onAnimalSelect={() => {}}
							onStartGame={() => {}}
							canStartGame={true}
						/>
					</div>

					<div style={{marginBottom: '60px'}}>
						<h3>Standard Mode - Configured (4 Players with Names)</h3>
						<SetupScreen
							mode="standard"
							unlockedAnimals={new Set(['Coyote', 'Llama', 'Tiger'])}
							playerCount={4}
							players={[
								{name: 'Alice', animalType: 'Coyote', playerType: 'human'},
								{name: 'Bob', animalType: 'Llama', playerType: 'human'},
								{name: 'Charlie', animalType: 'Tiger', playerType: 'computer'},
								{name: 'Diana', animalType: 'Coyote', playerType: 'computer'},
								...createDefaultPlayers(),
							]}
							selectedAnimal={null}
							opponentAnimal={null}
							onModeChange={() => {}}
							onPlayerCountChange={() => {}}
							onPlayerChange={() => {}}
							onAnimalSelect={() => {}}
							onStartGame={() => {}}
							canStartGame={true}
						/>
					</div>

					<div style={{marginBottom: '60px'}}>
						<h3>Challenger Mode - No Selection</h3>
						<SetupScreen
							mode="challenger"
							unlockedAnimals={new Set(['Coyote', 'Llama', 'Tiger'])}
							playerCount={2}
							players={createDefaultPlayers()}
							selectedAnimal={null}
							opponentAnimal="Tiger"
							onModeChange={() => {}}
							onPlayerCountChange={() => {}}
							onPlayerChange={() => {}}
							onAnimalSelect={() => {}}
							onStartGame={() => {}}
							canStartGame={false}
						/>
					</div>

					<div style={{marginBottom: '60px'}}>
						<h3>Challenger Mode - Animal Selected</h3>
						<SetupScreen
							mode="challenger"
							unlockedAnimals={new Set(['Coyote', 'Llama', 'Tiger'])}
							playerCount={2}
							players={createDefaultPlayers()}
							selectedAnimal="Coyote"
							opponentAnimal="Tiger"
							onModeChange={() => {}}
							onPlayerCountChange={() => {}}
							onPlayerChange={() => {}}
							onAnimalSelect={() => {}}
							onStartGame={() => {}}
							canStartGame={true}
						/>
					</div>

					<div style={{marginBottom: '60px'}}>
						<h3>Challenger Mode - All Animals Unlocked</h3>
						<SetupScreen
							mode="challenger"
							unlockedAnimals={new Set(['Coyote', 'Llama', 'Tiger', 'Gorilla', 'Monkey'])}
							playerCount={2}
							players={createDefaultPlayers()}
							selectedAnimal="Gorilla"
							opponentAnimal="Monkey"
							onModeChange={() => {}}
							onPlayerCountChange={() => {}}
							onPlayerChange={() => {}}
							onAnimalSelect={() => {}}
							onStartGame={() => {}}
							canStartGame={true}
						/>
					</div>

					<div style={{marginBottom: '60px'}}>
						<h3>Challenger Mode - No Opponent Available</h3>
						<SetupScreen
							mode="challenger"
							unlockedAnimals={new Set(['Coyote'])}
							playerCount={2}
							players={createDefaultPlayers()}
							selectedAnimal={null}
							opponentAnimal={null}
							onModeChange={() => {}}
							onPlayerCountChange={() => {}}
							onPlayerChange={() => {}}
							onAnimalSelect={() => {}}
							onStartGame={() => {}}
							canStartGame={false}
						/>
					</div>

					<div style={{marginBottom: '60px'}}>
						<h3>Standard Mode - Cannot Start</h3>
						<SetupScreen
							mode="standard"
							unlockedAnimals={new Set(['Coyote'])}
							playerCount={2}
							players={createDefaultPlayers()}
							selectedAnimal={null}
							opponentAnimal={null}
							onModeChange={() => {}}
							onPlayerCountChange={() => {}}
							onPlayerChange={() => {}}
							onAnimalSelect={() => {}}
							onStartGame={() => {}}
							canStartGame={false}
						/>
					</div>
				</div>
			);
		};

		return <AllVariantsDemo />;
	},
};
