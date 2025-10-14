import {Input} from '../Input/Input';
import {Select, type SelectOption} from '../Select/Select';
import type {AnimalType} from '../../lib/types';
import './PlayerSetup.css';

export interface PlayerSetupProperties {
	playerNumber: number;
	playerName: string;
	animalType: AnimalType;
	playerType: 'human' | 'computer';
	unlockedAnimals: Set<AnimalType>;
	onPlayerNameChange: (name: string) => void;
	onAnimalTypeChange: (animal: AnimalType) => void;
	onPlayerTypeChange: (type: 'human' | 'computer') => void;
	disabled?: boolean;
}

const allAnimals: AnimalType[] = ['Coyote', 'Llama', 'Tiger', 'Gorilla', 'Monkey'];

export function PlayerSetup({
	playerNumber,
	playerName,
	animalType,
	playerType,
	unlockedAnimals,
	onPlayerNameChange,
	onAnimalTypeChange,
	onPlayerTypeChange,
	disabled = false,
}: PlayerSetupProperties) {
	const availableAnimals = playerType === 'human' ? Array.from(unlockedAnimals) : allAnimals;

	const animalOptions: SelectOption[] = availableAnimals.map((animal) => ({
		value: animal,
		label: animal,
	}));

	const playerTypeOptions: SelectOption[] = [
		{value: 'human', label: 'Human'},
		{value: 'computer', label: 'Computer'},
	];

	const handlePlayerTypeChange = (newType: string) => {
		onPlayerTypeChange(newType as 'human' | 'computer');

		if (newType === 'human' && !unlockedAnimals.has(animalType)) {
			const firstUnlocked = Array.from(unlockedAnimals)[0];
			if (firstUnlocked) {
				onAnimalTypeChange(firstUnlocked);
			}
		}
	};

	return (
		<div className="player-setup">
			<label
				htmlFor={`player-${playerNumber}-name`}
				className="player-label"
			>
				Player {playerNumber}:
			</label>
			<Input
				id={`player-${playerNumber}-name`}
				value={playerName}
				onChange={onPlayerNameChange}
				placeholder={`Player ${playerNumber}`}
				disabled={disabled}
			/>
			<Select
				id={`player-${playerNumber}-animal`}
				value={animalType}
				options={animalOptions}
				onChange={(value) => onAnimalTypeChange(value as AnimalType)}
				disabled={disabled}
			/>
			<Select
				id={`player-${playerNumber}-type`}
				value={playerType}
				options={playerTypeOptions}
				onChange={handlePlayerTypeChange}
				disabled={disabled}
			/>
		</div>
	);
}
