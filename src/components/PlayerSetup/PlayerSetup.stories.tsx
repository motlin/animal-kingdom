import type {Meta, StoryObj} from '@storybook/react-vite';
import {useState} from 'react';
import {PlayerSetup} from './PlayerSetup';
import type {AnimalType} from '../../lib/types';

const meta = {
	title: 'Components/PlayerSetup',
	component: PlayerSetup,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
	argTypes: {
		disabled: {
			control: 'boolean',
		},
	},
} satisfies Meta<typeof PlayerSetup>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultUnlockedAnimals: Set<AnimalType> = new Set(['Coyote', 'Llama', 'Tiger']);
const allAnimals: Set<AnimalType> = new Set(['Coyote', 'Llama', 'Tiger', 'Gorilla', 'Monkey']);

export const HumanPlayerDefault: Story = {
	args: {
		playerNumber: 1,
		playerName: '',
		animalType: 'Coyote',
		playerType: 'human',
		unlockedAnimals: defaultUnlockedAnimals,
		onPlayerNameChange: () => {},
		onAnimalTypeChange: () => {},
		onPlayerTypeChange: () => {},
	},
};

export const HumanPlayerWithName: Story = {
	args: {
		playerNumber: 1,
		playerName: 'Alice',
		animalType: 'Llama',
		playerType: 'human',
		unlockedAnimals: defaultUnlockedAnimals,
		onPlayerNameChange: () => {},
		onAnimalTypeChange: () => {},
		onPlayerTypeChange: () => {},
	},
};

export const ComputerPlayer: Story = {
	args: {
		playerNumber: 2,
		playerName: 'Bot',
		animalType: 'Gorilla',
		playerType: 'computer',
		unlockedAnimals: defaultUnlockedAnimals,
		onPlayerNameChange: () => {},
		onAnimalTypeChange: () => {},
		onPlayerTypeChange: () => {},
	},
};

export const Player3: Story = {
	args: {
		playerNumber: 3,
		playerName: '',
		animalType: 'Tiger',
		playerType: 'human',
		unlockedAnimals: defaultUnlockedAnimals,
		onPlayerNameChange: () => {},
		onAnimalTypeChange: () => {},
		onPlayerTypeChange: () => {},
	},
};

export const AllAnimalsUnlocked: Story = {
	args: {
		playerNumber: 1,
		playerName: 'Pro Player',
		animalType: 'Monkey',
		playerType: 'human',
		unlockedAnimals: allAnimals,
		onPlayerNameChange: () => {},
		onAnimalTypeChange: () => {},
		onPlayerTypeChange: () => {},
	},
};

export const OnlyCoyoteUnlocked: Story = {
	args: {
		playerNumber: 1,
		playerName: '',
		animalType: 'Coyote',
		playerType: 'human',
		unlockedAnimals: new Set(['Coyote']),
		onPlayerNameChange: () => {},
		onAnimalTypeChange: () => {},
		onPlayerTypeChange: () => {},
	},
};

export const Disabled: Story = {
	args: {
		playerNumber: 1,
		playerName: 'Alice',
		animalType: 'Coyote',
		playerType: 'human',
		unlockedAnimals: defaultUnlockedAnimals,
		onPlayerNameChange: () => {},
		onAnimalTypeChange: () => {},
		onPlayerTypeChange: () => {},
		disabled: true,
	},
};

export const Interactive = {
	render: () => {
		const InteractivePlayerSetup = () => {
			const [player1Name, setPlayer1Name] = useState('');
			const [player1Animal, setPlayer1Animal] = useState<AnimalType>('Coyote');
			const [player1Type, setPlayer1Type] = useState<'human' | 'computer'>('human');

			const [player2Name, setPlayer2Name] = useState('');
			const [player2Animal, setPlayer2Animal] = useState<AnimalType>('Llama');
			const [player2Type, setPlayer2Type] = useState<'human' | 'computer'>('human');

			return (
				<div style={{padding: '20px', maxWidth: '800px'}}>
					<h3>Two Player Setup</h3>
					<PlayerSetup
						playerNumber={1}
						playerName={player1Name}
						animalType={player1Animal}
						playerType={player1Type}
						unlockedAnimals={defaultUnlockedAnimals}
						onPlayerNameChange={setPlayer1Name}
						onAnimalTypeChange={setPlayer1Animal}
						onPlayerTypeChange={setPlayer1Type}
					/>
					<PlayerSetup
						playerNumber={2}
						playerName={player2Name}
						animalType={player2Animal}
						playerType={player2Type}
						unlockedAnimals={defaultUnlockedAnimals}
						onPlayerNameChange={setPlayer2Name}
						onAnimalTypeChange={setPlayer2Animal}
						onPlayerTypeChange={setPlayer2Type}
					/>

					<div style={{marginTop: '30px', padding: '10px', backgroundColor: '#f0f0f0'}}>
						<h4>Current Configuration:</h4>
						<p>
							Player 1: {player1Name || '(no name)'} - {player1Animal} - {player1Type}
						</p>
						<p>
							Player 2: {player2Name || '(no name)'} - {player2Animal} - {player2Type}
						</p>
					</div>
				</div>
			);
		};

		return <InteractivePlayerSetup />;
	},
};

export const MultiplePlayersSetup = {
	render: () => {
		const MultiplePlayersDemo = () => {
			const [players, setPlayers] = useState([
				{name: '', animal: 'Coyote' as AnimalType, type: 'human' as 'human' | 'computer'},
				{name: '', animal: 'Llama' as AnimalType, type: 'human' as 'human' | 'computer'},
				{name: '', animal: 'Tiger' as AnimalType, type: 'computer' as 'human' | 'computer'},
				{name: '', animal: 'Coyote' as AnimalType, type: 'computer' as 'human' | 'computer'},
			]);

			const updatePlayer = (
				index: number,
				field: 'name' | 'animal' | 'type',
				value: string | AnimalType | 'human' | 'computer',
			) => {
				const newPlayers = [...players];
				if (field === 'name') {
					newPlayers[index]!.name = value as string;
				} else if (field === 'animal') {
					newPlayers[index]!.animal = value as AnimalType;
				} else if (field === 'type') {
					newPlayers[index]!.type = value as 'human' | 'computer';
				}
				setPlayers(newPlayers);
			};

			return (
				<div style={{padding: '20px', maxWidth: '800px'}}>
					<h3>Four Player Setup</h3>
					{players.map((player, index) => (
						<PlayerSetup
							key={index}
							playerNumber={index + 1}
							playerName={player.name}
							animalType={player.animal}
							playerType={player.type}
							unlockedAnimals={defaultUnlockedAnimals}
							onPlayerNameChange={(name) => updatePlayer(index, 'name', name)}
							onAnimalTypeChange={(animal) => updatePlayer(index, 'animal', animal)}
							onPlayerTypeChange={(type) => updatePlayer(index, 'type', type)}
						/>
					))}
				</div>
			);
		};

		return <MultiplePlayersDemo />;
	},
};

export const PlayerTypeToggling = {
	render: () => {
		const PlayerTypeTogglingDemo = () => {
			const [playerName, setPlayerName] = useState('Alice');
			const [animalType, setAnimalType] = useState<AnimalType>('Coyote');
			const [playerType, setPlayerType] = useState<'human' | 'computer'>('human');

			return (
				<div style={{padding: '20px', maxWidth: '800px'}}>
					<h3>Player Type Toggling Demo</h3>
					<p>
						Switch between Human and Computer to see how animal options change. Humans only see unlocked
						animals (Coyote, Llama, Tiger), while Computers see all animals.
					</p>
					<PlayerSetup
						playerNumber={1}
						playerName={playerName}
						animalType={animalType}
						playerType={playerType}
						unlockedAnimals={defaultUnlockedAnimals}
						onPlayerNameChange={setPlayerName}
						onAnimalTypeChange={setAnimalType}
						onPlayerTypeChange={setPlayerType}
					/>

					<div style={{marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0'}}>
						<h4>Current State:</h4>
						<p>Name: {playerName || '(no name)'}</p>
						<p>Animal: {animalType}</p>
						<p>Type: {playerType}</p>
						<p>
							Available animals:{' '}
							{playerType === 'human' ? 'Coyote, Llama, Tiger (unlocked only)' : 'All animals'}
						</p>
					</div>
				</div>
			);
		};

		return <PlayerTypeTogglingDemo />;
	},
};

export const AllVariants = {
	render: () => {
		const AllVariantsDemo = () => {
			return (
				<div style={{padding: '20px', maxWidth: '800px'}}>
					<div style={{marginBottom: '30px'}}>
						<h3>Human Player (Default)</h3>
						<PlayerSetup
							playerNumber={1}
							playerName=""
							animalType="Coyote"
							playerType="human"
							unlockedAnimals={defaultUnlockedAnimals}
							onPlayerNameChange={() => {}}
							onAnimalTypeChange={() => {}}
							onPlayerTypeChange={() => {}}
						/>
					</div>

					<div style={{marginBottom: '30px'}}>
						<h3>Human Player with Name</h3>
						<PlayerSetup
							playerNumber={2}
							playerName="Alice"
							animalType="Llama"
							playerType="human"
							unlockedAnimals={defaultUnlockedAnimals}
							onPlayerNameChange={() => {}}
							onAnimalTypeChange={() => {}}
							onPlayerTypeChange={() => {}}
						/>
					</div>

					<div style={{marginBottom: '30px'}}>
						<h3>Computer Player</h3>
						<PlayerSetup
							playerNumber={3}
							playerName="Bot"
							animalType="Gorilla"
							playerType="computer"
							unlockedAnimals={defaultUnlockedAnimals}
							onPlayerNameChange={() => {}}
							onAnimalTypeChange={() => {}}
							onPlayerTypeChange={() => {}}
						/>
					</div>

					<div style={{marginBottom: '30px'}}>
						<h3>Player with All Animals Unlocked</h3>
						<PlayerSetup
							playerNumber={4}
							playerName="Pro"
							animalType="Monkey"
							playerType="human"
							unlockedAnimals={allAnimals}
							onPlayerNameChange={() => {}}
							onAnimalTypeChange={() => {}}
							onPlayerTypeChange={() => {}}
						/>
					</div>

					<div style={{marginBottom: '30px'}}>
						<h3>Player with Only Coyote Unlocked</h3>
						<PlayerSetup
							playerNumber={5}
							playerName="Newbie"
							animalType="Coyote"
							playerType="human"
							unlockedAnimals={new Set(['Coyote'])}
							onPlayerNameChange={() => {}}
							onAnimalTypeChange={() => {}}
							onPlayerTypeChange={() => {}}
						/>
					</div>

					<div style={{marginBottom: '30px'}}>
						<h3>Disabled Player Setup</h3>
						<PlayerSetup
							playerNumber={6}
							playerName="Locked"
							animalType="Tiger"
							playerType="human"
							unlockedAnimals={defaultUnlockedAnimals}
							onPlayerNameChange={() => {}}
							onAnimalTypeChange={() => {}}
							onPlayerTypeChange={() => {}}
							disabled
						/>
					</div>
				</div>
			);
		};

		return <AllVariantsDemo />;
	},
};
