import {Select, type SelectOption} from '../../components/Select/Select';
import {PlayerSetup} from '../../components/PlayerSetup/PlayerSetup';
import type {AnimalType} from '../../lib/types';
import './StandardSetup.css';

export interface PlayerConfiguration {
	name: string;
	animalType: AnimalType;
	playerType: 'human' | 'computer';
}

export interface StandardSetupProperties {
	playerCount: number;
	players: PlayerConfiguration[];
	unlockedAnimals: Set<AnimalType>;
	onPlayerCountChange: (count: number) => void;
	onPlayerChange: (index: number, player: PlayerConfiguration) => void;
	disabled?: boolean;
}

export function StandardSetup({
	playerCount,
	players,
	unlockedAnimals,
	onPlayerCountChange,
	onPlayerChange,
	disabled = false,
}: StandardSetupProperties) {
	const playerCountOptions: SelectOption[] = Array.from({length: 9}, (_, i) => ({
		value: (i + 2).toString(),
		label: `${i + 2} Players`,
	}));

	const handlePlayerCountChange = (value: string) => {
		onPlayerCountChange(parseInt(value, 10));
	};

	return (
		<div className="standard-setup">
			<div className="setup-section">
				<Select
					id="player-count"
					label="Number of Players:"
					value={playerCount.toString()}
					options={playerCountOptions}
					onChange={handlePlayerCountChange}
					disabled={disabled}
				/>
			</div>

			<div className="player-selections">
				{players.slice(0, playerCount).map((player, index) => (
					<PlayerSetup
						key={index}
						playerNumber={index + 1}
						playerName={player.name}
						animalType={player.animalType}
						playerType={player.playerType}
						unlockedAnimals={unlockedAnimals}
						onPlayerNameChange={(name) => onPlayerChange(index, {...player, name})}
						onAnimalTypeChange={(animalType) => onPlayerChange(index, {...player, animalType})}
						onPlayerTypeChange={(playerType) => onPlayerChange(index, {...player, playerType})}
						disabled={disabled}
					/>
				))}
			</div>
		</div>
	);
}
