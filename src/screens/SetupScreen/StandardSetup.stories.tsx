import type {Meta, StoryObj} from '@storybook/react';
import {useState} from 'react';
import {StandardSetup, type PlayerConfiguration} from './StandardSetup';
import type {AnimalType} from '../../types';

const meta = {
	title: 'Screens/StandardSetup',
	component: StandardSetup,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
	argTypes: {
		disabled: {
			control: 'boolean',
		},
	},
} satisfies Meta<typeof StandardSetup>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultUnlockedAnimals: Set<AnimalType> = new Set(['Coyote', 'Llama', 'Tiger']);
const allAnimals: Set<AnimalType> = new Set(['Coyote', 'Llama', 'Tiger', 'Gorilla', 'Monkey']);

const createDefaultPlayers = (): PlayerConfiguration[] => {
	const animals: AnimalType[] = ['Coyote', 'Llama', 'Tiger', 'Gorilla', 'Monkey'];
	return Array.from({length: 10}, (_, i) => ({
		name: '',
		animalType: animals[i % animals.length]!,
		playerType: 'human' as const,
	}));
};

export const TwoPlayers: Story = {
	args: {
		playerCount: 2,
		players: createDefaultPlayers(),
		unlockedAnimals: defaultUnlockedAnimals,
		onPlayerCountChange: () => {},
		onPlayerChange: () => {},
	},
};

export const ThreePlayers: Story = {
	args: {
		playerCount: 3,
		players: createDefaultPlayers(),
		unlockedAnimals: defaultUnlockedAnimals,
		onPlayerCountChange: () => {},
		onPlayerChange: () => {},
	},
};

export const FourPlayers: Story = {
	args: {
		playerCount: 4,
		players: createDefaultPlayers(),
		unlockedAnimals: defaultUnlockedAnimals,
		onPlayerCountChange: () => {},
		onPlayerChange: () => {},
	},
};

export const SixPlayers: Story = {
	args: {
		playerCount: 6,
		players: createDefaultPlayers(),
		unlockedAnimals: defaultUnlockedAnimals,
		onPlayerCountChange: () => {},
		onPlayerChange: () => {},
	},
};

export const TenPlayers: Story = {
	args: {
		playerCount: 10,
		players: createDefaultPlayers(),
		unlockedAnimals: defaultUnlockedAnimals,
		onPlayerCountChange: () => {},
		onPlayerChange: () => {},
	},
};

export const WithPrefilledNames: Story = {
	args: {
		playerCount: 4,
		players: [
			{name: 'Alice', animalType: 'Coyote', playerType: 'human'},
			{name: 'Bob', animalType: 'Llama', playerType: 'human'},
			{name: 'Charlie', animalType: 'Tiger', playerType: 'computer'},
			{name: 'Diana', animalType: 'Coyote', playerType: 'computer'},
			...createDefaultPlayers(),
		],
		unlockedAnimals: defaultUnlockedAnimals,
		onPlayerCountChange: () => {},
		onPlayerChange: () => {},
	},
};

export const MixedPlayerTypes: Story = {
	args: {
		playerCount: 5,
		players: [
			{name: 'Player 1', animalType: 'Coyote', playerType: 'human'},
			{name: 'Bot 1', animalType: 'Llama', playerType: 'computer'},
			{name: 'Player 2', animalType: 'Tiger', playerType: 'human'},
			{name: 'Bot 2', animalType: 'Gorilla', playerType: 'computer'},
			{name: 'Bot 3', animalType: 'Monkey', playerType: 'computer'},
			...createDefaultPlayers(),
		],
		unlockedAnimals: allAnimals,
		onPlayerCountChange: () => {},
		onPlayerChange: () => {},
	},
};

export const AllAnimalsUnlocked: Story = {
	args: {
		playerCount: 3,
		players: createDefaultPlayers(),
		unlockedAnimals: allAnimals,
		onPlayerCountChange: () => {},
		onPlayerChange: () => {},
	},
};

export const OnlyCoyoteUnlocked: Story = {
	args: {
		playerCount: 2,
		players: createDefaultPlayers(),
		unlockedAnimals: new Set(['Coyote']),
		onPlayerCountChange: () => {},
		onPlayerChange: () => {},
	},
};

export const Disabled: Story = {
	args: {
		playerCount: 3,
		players: [
			{name: 'Alice', animalType: 'Coyote', playerType: 'human'},
			{name: 'Bob', animalType: 'Llama', playerType: 'human'},
			{name: 'Charlie', animalType: 'Tiger', playerType: 'computer'},
			...createDefaultPlayers(),
		],
		unlockedAnimals: defaultUnlockedAnimals,
		onPlayerCountChange: () => {},
		onPlayerChange: () => {},
		disabled: true,
	},
};

export const Interactive = {
	render: () => {
		const InteractiveStandardSetup = () => {
			const [playerCount, setPlayerCount] = useState(3);
			const [players, setPlayers] = useState<PlayerConfiguration[]>(createDefaultPlayers());

			const handlePlayerChange = (index: number, player: PlayerConfiguration) => {
				const newPlayers = [...players];
				newPlayers[index] = player;
				setPlayers(newPlayers);
			};

			return (
				<div style={{padding: '20px', maxWidth: '1000px'}}>
					<h2 style={{marginBottom: '20px'}}>Standard Mode Setup</h2>
					<StandardSetup
						playerCount={playerCount}
						players={players}
						unlockedAnimals={defaultUnlockedAnimals}
						onPlayerCountChange={setPlayerCount}
						onPlayerChange={handlePlayerChange}
					/>

					<div style={{marginTop: '30px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px'}}>
						<h3>Current Configuration:</h3>
						<p>
							<strong>Player Count:</strong> {playerCount}
						</p>
						<div style={{marginTop: '10px'}}>
							<strong>Players:</strong>
							<ul style={{marginTop: '5px', paddingLeft: '20px'}}>
								{players.slice(0, playerCount).map((player, index) => (
									<li key={index}>
										Player {index + 1}: {player.name || '(no name)'} - {player.animalType} -{' '}
										{player.playerType}
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			);
		};

		return <InteractiveStandardSetup />;
	},
};

export const PlayerCountChange = {
	render: () => {
		const PlayerCountChangeDemo = () => {
			const [playerCount, setPlayerCount] = useState(2);
			const [players, setPlayers] = useState<PlayerConfiguration[]>(createDefaultPlayers());

			const handlePlayerChange = (index: number, player: PlayerConfiguration) => {
				const newPlayers = [...players];
				newPlayers[index] = player;
				setPlayers(newPlayers);
			};

			return (
				<div style={{padding: '20px', maxWidth: '1000px'}}>
					<h2 style={{marginBottom: '20px'}}>Player Count Change Demo</h2>
					<p style={{marginBottom: '20px'}}>
						Change the player count to see how the setup dynamically adjusts. Player data is preserved when
						increasing and decreasing the count.
					</p>
					<StandardSetup
						playerCount={playerCount}
						players={players}
						unlockedAnimals={defaultUnlockedAnimals}
						onPlayerCountChange={setPlayerCount}
						onPlayerChange={handlePlayerChange}
					/>

					<div style={{marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
						{[2, 3, 4, 5, 6, 8, 10].map((count) => (
							<button
								key={count}
								onClick={() => setPlayerCount(count)}
								style={{
									padding: '8px 16px',
									backgroundColor: playerCount === count ? '#A0522D' : '#DEB887',
									color: playerCount === count ? 'white' : '#6B4423',
									border: 'none',
									borderRadius: '6px',
									cursor: 'pointer',
									fontFamily: 'Merriweather, serif',
								}}
							>
								{count} Players
							</button>
						))}
					</div>
				</div>
			);
		};

		return <PlayerCountChangeDemo />;
	},
};

export const AllVariants = {
	render: () => {
		const AllVariantsDemo = () => {
			return (
				<div style={{padding: '20px', maxWidth: '1000px'}}>
					<div style={{marginBottom: '40px'}}>
						<h3>2 Players (Default)</h3>
						<StandardSetup
							playerCount={2}
							players={createDefaultPlayers()}
							unlockedAnimals={defaultUnlockedAnimals}
							onPlayerCountChange={() => {}}
							onPlayerChange={() => {}}
						/>
					</div>

					<div style={{marginBottom: '40px'}}>
						<h3>4 Players with Names</h3>
						<StandardSetup
							playerCount={4}
							players={[
								{name: 'Alice', animalType: 'Coyote', playerType: 'human'},
								{name: 'Bob', animalType: 'Llama', playerType: 'human'},
								{name: 'Computer 1', animalType: 'Tiger', playerType: 'computer'},
								{name: 'Computer 2', animalType: 'Coyote', playerType: 'computer'},
								...createDefaultPlayers(),
							]}
							unlockedAnimals={defaultUnlockedAnimals}
							onPlayerCountChange={() => {}}
							onPlayerChange={() => {}}
						/>
					</div>

					<div style={{marginBottom: '40px'}}>
						<h3>6 Players - Mixed Types</h3>
						<StandardSetup
							playerCount={6}
							players={[
								{name: 'Player 1', animalType: 'Coyote', playerType: 'human'},
								{name: 'Bot 1', animalType: 'Llama', playerType: 'computer'},
								{name: 'Player 2', animalType: 'Tiger', playerType: 'human'},
								{name: 'Bot 2', animalType: 'Coyote', playerType: 'computer'},
								{name: 'Player 3', animalType: 'Llama', playerType: 'human'},
								{name: 'Bot 3', animalType: 'Tiger', playerType: 'computer'},
								...createDefaultPlayers(),
							]}
							unlockedAnimals={defaultUnlockedAnimals}
							onPlayerCountChange={() => {}}
							onPlayerChange={() => {}}
						/>
					</div>

					<div style={{marginBottom: '40px'}}>
						<h3>10 Players (Maximum)</h3>
						<StandardSetup
							playerCount={10}
							players={createDefaultPlayers()}
							unlockedAnimals={allAnimals}
							onPlayerCountChange={() => {}}
							onPlayerChange={() => {}}
						/>
					</div>

					<div style={{marginBottom: '40px'}}>
						<h3>Only Coyote Unlocked</h3>
						<StandardSetup
							playerCount={3}
							players={createDefaultPlayers()}
							unlockedAnimals={new Set(['Coyote'])}
							onPlayerCountChange={() => {}}
							onPlayerChange={() => {}}
						/>
					</div>

					<div style={{marginBottom: '40px'}}>
						<h3>Disabled State</h3>
						<StandardSetup
							playerCount={3}
							players={[
								{name: 'Alice', animalType: 'Coyote', playerType: 'human'},
								{name: 'Bob', animalType: 'Llama', playerType: 'human'},
								{name: 'Charlie', animalType: 'Tiger', playerType: 'computer'},
								...createDefaultPlayers(),
							]}
							unlockedAnimals={defaultUnlockedAnimals}
							onPlayerCountChange={() => {}}
							onPlayerChange={() => {}}
							disabled
						/>
					</div>
				</div>
			);
		};

		return <AllVariantsDemo />;
	},
};
